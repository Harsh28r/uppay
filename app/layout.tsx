import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'assignment App',
  description: '',
  generator: 'Harsh',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
