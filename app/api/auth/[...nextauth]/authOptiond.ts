import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"

// console.log(process.env.NEXTAUTH_SECRET)
export const authOptions: NextAuthOptions={
    session:{
        strategy:'jwt'
    },
    secret:process.env.NEXTAUTH_SECRET,
    callbacks:{
      async jwt({token, user}) {
      
        if (user?.id) {
            token.id= user.id
            // console.log("uid: ",user.id)
        }
        return token
     },
     async session({session, token}) {
      session.id = token.id;
      return session;
  }
    },
    providers: [
        CredentialsProvider({
          // The name to display n the sign in form (e.g. "Sign in with...")
          name: "Credentials",
          credentials: {
            username: { label: "Username", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials, req) {
            // console.log(credentials)
            // console.log(process.env.NEXTAUTH_SECRET)
            // Add logic here to look up the user from the credentials supplied

            
            // const res = await fetch("http://localhost:3000/api", {
            //   method: "GET",
            //   headers: {
            //     "Content-Type": "application/json",
            //   },
            // });
            // const userjson = await res.json();
            // console.log(userjson)

            const data =await fetch(`http://localhost:3000/api/user?name=${credentials?.username}`,{
                        method:"GET",
                          headers:{
                            "Content-Type":"application/json"
                          },
                        //   body:JSON.stringify({
                        //     name:credentials?.username
                        // })
                         })
            const datajson=await data.json()
            console.log("USERRRR : ",datajson)
            const user = { id: datajson.user.id, name: datajson.user.name, email: "jsmith@example.com"}

            if (datajson.user) {
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