import type { Metadata } from 'next'
import { Inter, Joti_One } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })
const jotiOne = Joti_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-joti-one',
})

export const metadata: Metadata = {
  title: 'Fog of Noir',
  description: 'A Fog of Noir strategy game built with Next.js, TypeScript, and Phaser',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${jotiOne.variable} bg-black text-white`}>
        <Header />
        {children}
      </body>
    </html>
  )
}
