import { authOptions } from "./authOptiond"


import NextAuth from "next-auth"


// console.log(process.env.NEXTAUTH_SECRET)


const handler=NextAuth(authOptions)
export {handler as GET, handler as POST}