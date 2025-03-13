import './globals.css'

export const metadata = {
  title: 'Friendship Ended Generator',
  description: 'Your friendship has ended and I am so sorry.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}