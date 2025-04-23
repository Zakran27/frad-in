import './globals.css'

export const metadata = {
  title: 'Thomas Fradin de Bellabre',
  description: 'Exploring tech projects and side experiments by Thomas Fradin de Bélabre',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
