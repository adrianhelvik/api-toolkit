import PostgresDatabase from './databases/PostgresDatabase'

export default {
  postgres(userSettings) {
    return new PostgresDatabase(settings)
  }
}
