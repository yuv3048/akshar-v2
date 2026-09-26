import { db } from "./prisma/db";


const users = await db.orm.public.User.all();

console.log("Users:", users);

await db.close();