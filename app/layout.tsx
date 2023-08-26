import './globals.css'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import MyContextProvider from './MyContext'
import NavButtom from './component/navBottom'
import NavTop from './component/navTop'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kasir',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <meta name="google" content="notranslate"></meta>
      <meta name="viewport" content="width=device-width; initial-scale=1.0;"></meta>
   
      <body className={inter.className}>
        <Providers>
          <MyContextProvider>
            <NavTop/>
            {children}
            <NavButtom/>
          </MyContextProvider>
        </Providers>
      </body>
   
    </html>
  )
}
