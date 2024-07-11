import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  BeforeCreate,
  BeforeUpdate,
  PrimaryKey,
  AutoIncrement
} from "sequelize-typescript";
import { hash, compare } from "bcryptjs";
import { DataTypes, Model } from "sequelize";
import sequelize from "@/database";

class User extends Model {
  declare id: number;

  declare name: string;

  declare email: string;

  declare password: string;

  declare createdAt: Date;

  declare updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "Users",
    sequelize
  }
)

export { User };
