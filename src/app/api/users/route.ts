import sequelize from "@/database";
import { User } from "../../../models/User";

export async function GET() {
  await User.create({
    name: "john",
    email: "johndoe@gmail.com",
    password: "teste"
  })
  return Response.json({ message: "Created" })
}