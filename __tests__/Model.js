import Model from '../src/Model'

describe('Model', () => {
  let ConcreteModel
  beforeEach(() => {
    Model.setDialect('postgres')

    ConcreteModel = class extends Model {
      static table = 'some-table'
      static columns = ['id', 'name', 'role']
      static db = {
        query: jest.fn()
      }
    }
  })

  describe('static methods', () => {
    describe('.one()', () => {
      describe('.createQueryForOne()', () => {
        it('creates the correct sql', () => {
          const expectedSql = 'SELECT "some-table".* FROM "some-table" WHERE ("some-table"."id" = $1) LIMIT 1'
          const id = 'some-id'

          const query = ConcreteModel.createQueryForOne('some-id')

          expect(query.query).toBe(expectedSql)
          expect(query.values).toEqual([id])
        })
      })

      it('returns an instance of the model class', async () => {
        ConcreteModel.db.query.mockReturnValueOnce([
          { id: 'some-id' }
        ])

        const instance = await ConcreteModel.one('some-id')

        expect(instance instanceof Model).toBeTruthy()
        expect(instance instanceof ConcreteModel).toBeTruthy()
      })
    })

    describe('.all()', () => {
      describe('.createQueryForAll()', () => {
        it('creates the correct sql', () => {
          const expectedSql = 'SELECT "some-table".* FROM "some-table"'

          const query = ConcreteModel.createQueryForAll()

          expect(query.query).toBe(expectedSql)
          expect(query.values).toEqual([])
        })
      })

      it('returns instances of the model class', async () => {
        ConcreteModel.db.query.mockReturnValueOnce([
          { id: 'some-id' },
          { id: 'some-other-id' }
        ])

        const instances = await ConcreteModel.all()

        expect(instances.length).toBe(2)

        for (const instance of instances) {
          expect(instance instanceof Model).toBeTruthy()
          expect(instance instanceof ConcreteModel).toBeTruthy()
        }
      })
    })

    describe('.update()', () => {
      it('creates the correct sql', async () => {
        const expectedSql = 'UPDATE "some-table" SET "name" = $1 WHERE ("some-table"."id" = $2)'
        const expectedValues = ['A name', 'my-id']
        const newInstance = { id: 'some-new-instance' }

        ConcreteModel.db.query
          .mockReturnValueOnce([]) // for update
          .mockReturnValueOnce([newInstance]) // for fetching the instance instance

        const actualNewInstance = await ConcreteModel.update('my-id', { name: 'A name' })

        expect(actualNewInstance.id).toBe(newInstance.id)
        expect(actualNewInstance instanceof ConcreteModel).toBeTruthy()
        expect(ConcreteModel.db.query).toBeCalledWith({ query: expectedSql, values: expectedValues })
      })

      it('throws an error if there are no updates', async () => {
        const expectedSql = 'UPDATE "some-table" SET "name" = $1 WHERE ("some-table"."id" = $2)'
        const expectedValues = ['A name', 'my-id']

        try {
          await ConcreteModel.update('my-id')
        } catch (error) {
          expect(error.httpStatusCode).toBe(422)
          expect(error.message).toBe('[Model]: Updates are required')
        }
      })
    })

    describe('.destroy()', () => {
      const id = 'some-id'
      const expectedSql = 'DELETE FROM "some-table" WHERE ("some-table"."id" = $1)'
      const expectedValues = [id]

      it('creates the correct sql', () => {
        const query = ConcreteModel.createQueryForDestroy(id)

        expect(query.query).toBe(expectedSql)
        expect(query.values).toEqual(expectedValues)
      })

      it('calls the database with the correct sql', async () => {
        ConcreteModel.db.query
          .mockReturnValueOnce([])

        await ConcreteModel.destroy(id)

        expect(ConcreteModel.db.query).toBeCalledWith({
          query: expectedSql,
          values: expectedValues
        })
      })
    })

    describe('create', () => {
      let instance

      beforeEach(async () => {
        ConcreteModel.db.query
          .mockReturnValueOnce([])

        instance = await ConcreteModel.create({
          name: 'some-name',
          role: 'some-role'
        })
      })

      it('inserts an instance into the database', () => {
        expect(ConcreteModel.db.query).toBeCalledWith({
          query: 'INSERT INTO "some-table" ("name", "role") VALUES ($1, $2) RETURNING *',
          values: ['some-name', 'some-role']
        })
      })

      it('returns the created instance', () => {
        expect(instance instanceof ConcreteModel).toBeTruthy()
        expect(instance.name).toBe('some-name')
        expect(instance.role).toBe('some-role')
      })
    })

    describe('saving an instance', () => {
      let instance
      beforeEach(() => {
        instance = new ConcreteModel({
          name: 'some-name',
          role: 'some-role'
        })
      })

      test('.extractValues()', () => {
        const expected = {
          name: 'some-name',
          role: 'some-role'
        }
        const actual = instance.extractValues()

        expect(actual).toEqual(expected)
      })
    })
  })

  describe('instance methods', () => {
    describe('.save()', () => {
      it('saves the instance to the database', async () => {
        const instance = new ConcreteModel()
        instance.role = 'some-role'

        ConcreteModel.db.query
          .mockReturnValueOnce([])

        await instance.save()

        expect(ConcreteModel.db.query).toBeCalledWith({
          query: 'INSERT INTO "some-table" ("role") VALUES ($1) RETURNING *',
          values: ['some-role']
        })
      })
    })
    describe('.destroy()', () => {
    })
    describe('.loadRelations()', () => {
    })
  })
})
