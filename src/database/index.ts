
import { Sequelize } from "sequelize";
import { SequelizeOptions } from "sequelize-typescript";
import dbConfig from "../config/config.json"

const dbOptions = <SequelizeOptions>dbConfig;
dbOptions.dialectModule = require("pg")

const sequelize = new Sequelize(dbOptions,);

export default sequelize;
