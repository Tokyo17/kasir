import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions={
    session:{
        strategy:'jwt'
    },
    secret:process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
          // The name to display n the sign in form (e.g. "Sign in with...")
          name: "Credentials",
          credentials: {
            username: { label: "Username", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials, req) {
            console.log(credentials)
            // Add logic here to look up the user from the credentials supplied
            const user = { id: "1", name: credentials?.username, email: "jsmith@example.com" }
      
            if (user) {
              // Any object returned will be saved in `user` property of the JWT
              return user
            } else {
              // If you return null then an error will be displayed advising the user to check their details.
              return null
      
            }
          }
        })
      ]
}