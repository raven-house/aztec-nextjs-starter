import type { Metadata } from 'next'
import { Inter, Joti_One } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { GlobalContextProvider } from '@/contexts/GlobalContext'
import { NodeInfo } from '@/components/NodeInfo'

const inter = Inter({ subsets: ['latin'] })
const jotiOne = Joti_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-joti-one',
})
export const metadata: Metadata = {
  title: 'Aztec Next.js Starter',
  description:
    'A modern Next.js starter template with Aztec integration for building web3 applications',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${jotiOne.variable} bg-black text-white`}>
        <GlobalContextProvider>
          <>
            <Header />
            {children}
            <NodeInfo />
          </>
        </GlobalContextProvider>
      </body>
    </html>
  )
}
