import sql from 'sql'
import EventEmitter from 'events'

class Model {
  static _table = null
  static db = null

  /**
   * Set the type of database that is used.
   */
  static setDialect(dialect) {
    sql.setDialect(dialect)
  }

  /**
   * Create an event emitter on demand to isolate it to each subclass
   */
  static get _eventEmitter() {
    if (! this.__eventEmitter) {
      this.__eventEmitter = new EventEmitter()
    }
    return this.__eventEmitter
  }

  /**
   * Whether to automatically load relations specified in hasMany and manyToMany
   */
  static eagerLoadRelations = false

  static get table() {
    if (typeof this._table === 'string') {
      this.convertTableNameToTableInstance()
    }

    return this._table
  }

  static on(...args) {
    return this._eventEmitter.on(...args)
  }

  static once(...args) {
    return this._eventEmitter.once(...args)
  }

  static emit(...args) {
    return this._eventEmitter.emit(...args)
  }

  static set table(table) {
    this._table = table
  }

  static convertTableNameToTableInstance() {
    console.assert(
      Array.isArray(this.columns),
      `${this._table}: Model expects the static column property`
      + ` to be an array of strings. Got ${this.columns}`
    )

    this._table = sql.define({
      name: this._table,
      columns: this.columns
    })
  }

  constructor(fields) {
    Object.assign(this, fields)
  }

  static createQueryForAll(whereClauses) {
    const { table } = this

    let query = table
      .select(table.star())
      .from(table)

    if (whereClauses) {
      query = query
        .where(whereClauses)
    }

    query = query.toQuery()

    return {
      query: query.text,
      values: query.values
    }
  }

  static async all(whereClauses = null) {
    const query = this.createQueryForAll(whereClauses)
    const instances = this.executeQueryAndCreateInstances(query)

    return instances
  }

  static async executeQueryAndCreateInstances(query) {
    if (! query) {
      throw Error('Model#executeQueryAndCreateInstances called without a query')
    }
    if (! query.query) {
      throw Error('Model#executeQueryAndCreateInstances called without query.query')
    }
    if (! query.values) {
      throw Error('Model#executeQueryAndCreateInstances called without query.values')
    }

    const dbResponse = await this.db.query(query)

    const instances = dbResponse
      .map(data => new this(data))

    if (this.eagerLoadRelations) {
      for (const instance of instances) {
        await instance.loadRelations()
      }
    }

    return instances
  }

  /**
   * Query the database and return new instances of this class for every match.
   */
  static async query(closure) {
    const { table } = this
    const query = await closure(table)
    return this.executeQueryAndCreateInstances(query)
  }

  static async filterOnKey(key, val) {
    if (! this.table[key]) {
      throw Error(`The column ${key} was not found on the table: ${this.table._name}`)
    }

    const query = this.table
      .select(this.table.star())
      .from(this.table)
      .where(this.table[key].equals(val))
      .toQuery()

    const matches = await this.executeQueryAndCreateInstances({
      query: query.text,
      values: query.values
    })

    return matches
  }

  async loadRelations() {
    await this.loadHasManyRelations()
    await this.loadManyToManyRelations()
    await this.loadHasOneRelations()
  }

  async loadHasOneRelations() {
    const { hasOne } = this.constructor

    if (! hasOne) {
      return
    }

    for (const relation of Object.keys(hasOne)) {
      await this.loadHasOneRelation(relation, hasOne[relation])
    }
  }

  async loadHasOneRelation(relation, { ownKey, model }) {
    if (this[Symbol.for(relation)]) {
      return
    }

    const related = await model.oneWhere({
      id: this[ownKey]
    })

    this[relation] = related

    if (this.constructor.eagerLoadRelations) {
      related.loadRelations()
    }

    this[Symbol.for(relation)] = true
  }

  async loadHasManyRelations() {
    const { hasMany, table } = this.constructor

    if (hasMany) {
      for (const relation of Object.keys(hasMany)) {
        // TODO: Use Promise.all instead. But bear race conditions in mind
        try {
          await this.loadHasManyRelation(relation, hasMany[relation])
        } catch (err) {
          if (hasMany.model && hasMany.foreignKey) {
            throw Error('[loadHasManyRelation]: You forget to create a mapping from a key to { model, options }')
          }
          throw err
        }
      }
    }
  }

  async loadHasManyRelation(name, options) {
    const { foreignKey, relatedModel } = this.constructor.parseHasManyOptions(options)

    if (! relatedModel) {
      throw Error('Cannot load hasMany relations for non-model!')
    }

    const related = await relatedModel.filterOnKey(foreignKey, this.id)

    if (this.eagerLoadRelations) {
      related.loadRelations()
    }

    this[name] = related
  }

  static parseHasManyOptions(options) {
    const { table } = this

    // TODO: Find better test
    const optionsIsModel = Boolean(
      options.parseHasManyOptions
    )

    if (optionsIsModel) {
      return {
        foreignKey: table._name + '_id',
        relatedModel: options
      }
    }

    if (! options.foreignKey) {
      throw Error('[parseHasManyOptions]: Foreign key not specified for relation. Got: ' + String(options))
    }

    if (! options.model) {
      throw Error('[parseHasManyOptions]: Model not specified for relation. Got: ' + String(options))
    }

    return {
      foreignKey: options.foreignKey,
      relatedModel: options.model
    }
  }

  async loadManyToManyRelations() {
    const { manyToMany, table } = this.constructor
    const { id } = this

    if (manyToMany) {
      for (const relation of Object.keys(manyToMany)) {
        const relatedModel = manyToMany[relation]

        const tableNameOfThis = table._name
        const tableNameOfRelated = relatedModel.table._name
        const nameOfPivotTable = tableNameOfThis + '_' + tableNameOfRelated

        const keyOfThis = tableNameOfThis + '_id'
        const keyOfRelated = tableNameOfRelated + '_id'

        const pivotTable = sql.define({
          name: nameOfPivotTable,
          columns: [keyOfThis, keyOfRelated]
        })
        const relatedTable = relatedModel.table

        const query = {
          query: `
            SELECT * FROM "${nameOfPivotTable}"
            JOIN "${tableNameOfRelated}"
            ON "${nameOfPivotTable}"."${keyOfRelated}"="${tableNameOfRelated}"."id"
          `,
          values: []
        }

        const dbResponse = await this.constructor.db.query(query)

        this[relation] = dbResponse
          .map(data => {
            const instance = new relatedModel(data)
            if (this.eagerLoadRelations) {
              instance.loadRelations()
            }
            return instance
          })
      }
    }
  }

  static createQueryForOne(id) {
    const { table } = this

    const query = table
      .select(table.star())
      .from(table)
      .where(table.id.equals(id))
      .limit(1)
      .toQuery()

    return {
      query: query.text,
      values: query.values
    }
  }

  static async oneWhere(whereClauses = {}) {
    const dbQuery = this.table
      .select(this.table.star())
      .from(this.table)
      .where(whereClauses)
      .limit(1)
      .toQuery()

    const query = dbQuery.text
    const values = dbQuery.values

    const dbResponse = await this.db.query({ query, values })

    return new this(dbResponse[0])
  }

  static async one(id) {
    if (id && typeof id === 'object') {
      return this.oneWhere(id)
    }

    const query = this.createQueryForOne(id)
    const dbResponse = await this.db.query(query)
    const modelData = dbResponse[0]

    if (! modelData) {
      return null
    }

    const instance = new this(modelData)

    return instance
  }

  extractValues() {
    const values = {}

    for (const key of Object.keys(this)) {
      values[key] = this[key]
    }

    return values
  }

  async save() {
    const { table } = this.constructor

    const values = this.extractValues()

    const query = table
      .insert(values)
      .returning(table.star())
      .toQuery()

    const dbResponse = await this.constructor.db.query({
      query: query.text,
      values: query.values
    })

    const newColumns = dbResponse[0]

    Object.assign(this, newColumns)
  }

  static async create(fields) {
    const instance = new this(fields)
    await instance.save()

    this.emit('create', instance)

    return instance
  }

  static createQueryForDestroy(id) {
    const { table } = this

    const query = table
      .delete()
      .where(table.id.equals(id))
      .toQuery()

    return {
      query: query.text,
      values: query.values
    }
  }

  static async destroy(id) {
    const removedData = await this.one(id)

    const query = this.createQueryForDestroy(id)
    await this.db.query(query)

    this.emit('destroy', removedData)
  }

  async destroy() {
    await this.constructor.destroy(this.id)
  }

  static createQueryForUpdate(id, updates) {
    const { table } = this

    const query = table
      .update(updates)
      .where(table.id.equals(id))
      .toQuery()

    return {
      query: query.text,
      values: query.values
    }
  }

  static async update(id, updates = {}) {
    if (! Object.keys(updates).length) {
      const error = Error('[Model]: Updates are required')
      error.httpStatusCode = 422
      throw error
    }

    const query = this.createQueryForUpdate(id, updates)
    await this.db.query(query)
    const newValue = await this.one(id)
    this.emit('update', newValue)
    return newValue
  }
}

export default Model
