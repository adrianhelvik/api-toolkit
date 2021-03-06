class PostgresDatabase {
  constructor(userSettings) {

    userSettings = {
      ...userSettings,
      user: userSettings.username
    }

    // Load dependencies on demand only
    const pg = require('pg')
    const Pool = require('pg-pool')

    const settings = {
      Client: pg.Client,
      idleTimeoutMillis: 1000,
      ...userSettings
    }

    this.pool = new Pool(settings)
    this.connect()
      .catch(error => {
        throw error
      })
  }

  async connect() {
    if (this.connection) {
      return this.connection
    }
    this.connection = await this.pool.connect()
    return this.connection
  }

  async query({ query, values }) {
    const connection = await this.connect()
    const dbResponse = await connection.query(query, values)

    return dbResponse.rows
  }
}

export default PostgresDatabase
