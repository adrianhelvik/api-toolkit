import PostgresDatabase from './databases/PostgresDatabase'

export default {
  postgres(settings) {
    return new PostgresDatabase(settings)
  }
}
