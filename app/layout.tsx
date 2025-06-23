import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ByteCode',
  description:
    'ByteCode is a versatile AI chatbot designed to assist with a wide range of tasks, from answering questions to providing recommendations and engaging in casual conversation.',
  generator: 'ByteCode Limited',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'ByteCode',
    siteName: 'ByteCode-Limited',
    url: 'https://ByteCode-Limited.vercel.app/',
    description:
      'ByteCode is a versatile AI chatbot designed to assist with a wide range of tasks, from answering questions to providing recommendations and engaging in casual conversation.',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ByteCode AI Chatbot',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ByteCode',
    description:
      'ByteCode is a versatile AI chatbot designed to assist with a wide range of tasks, from answering questions to providing recommendations and engaging in casual conversation.',
    images: ['/og-image.jpg'],
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
