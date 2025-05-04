import { currentUser } from "@clerk/nextjs/server";

const user = currentUser;

if (!user) throw "Unauthorized";