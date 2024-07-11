import sequelize from "@/database";
import { User } from "../../../models/User";
import { NextRequest } from "next/server";
import { headers } from 'next/headers'


export async function GET() {
  const headersList = headers()
  const userId = headersList.get("x-user-id")
  return Response.json({ message: userId })
}