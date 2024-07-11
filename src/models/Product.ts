import { DataTypes, Model } from "sequelize";
import sequelize from "@/database";

class User extends Model {
  declare id: number;

  declare name: string;

  declare description: string;

  declare price: number;

  declare userId: string;

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
    userId: {
      type: DataTypes.INTEGER,
      references: { model: "Users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: "users",
    sequelize,
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
)

export { User };
