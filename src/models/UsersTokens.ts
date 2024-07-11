import { DataTypes, Model } from "sequelize";
import sequelize from "@/database";

class UsersTokens extends Model {
  declare id: number;

  declare userId: string;

  declare refreshToken: string;

  declare expiresDate: string;

  declare createdAt: Date;
}

UsersTokens.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: "Users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expiresDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    tableName: "UsersTokens",
    sequelize
  }
)

export { UsersTokens };
