import { DataSource, DataSourceOptions } from "typeorm"

let dbConfig: DataSourceOptions = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  logging: false,
  synchronize: true,
  entities: [`src/entities/**/*{.ts,.js}`],
  migrations: [
    `src/migrations/*{.ts,.js}`
  ],
}

if (process.env.NODE_ENV === 'production') {
  dbConfig = {
    type: "postgres",
    name: "",
    username: "",
    password: "",
    host: "",
    port: 25060,
    database: "",
    logging: false,
    synchronize: false,
    entities: [`dist/entities/**/*{.ts,.js}`],
    migrations: [
      `dist/migrations/*{.ts,.js}`
    ],
    ssl: {
      rejectUnauthorized: false
    }
  }
}

const AppDataSource = new DataSource(dbConfig)


export default AppDataSource;
