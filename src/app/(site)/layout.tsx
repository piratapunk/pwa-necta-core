import { ChatProvider } from '@/components/chat/ChatContext'
import { ChatWidget } from '@/components/chat/ChatWidget'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ChatProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ChatWidget />
    </ChatProvider>
  )
}
