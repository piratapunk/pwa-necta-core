'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'

type ChatContextValue = {
  isOpen: boolean
  pendingMessage: string | null
  openChat: (initialMessage?: string) => void
  closeChat: () => void
  consumePendingMessage: () => string | null
}

const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [pendingMessage, setPendingMessage] = useState<string | null>(null)

  const openChat = useCallback((initialMessage?: string) => {
    if (initialMessage) setPendingMessage(initialMessage)
    setIsOpen(true)
  }, [])

  const closeChat = useCallback(() => setIsOpen(false), [])

  const consumePendingMessage = useCallback(() => {
    if (!pendingMessage) return null
    setPendingMessage(null)
    return pendingMessage
  }, [pendingMessage])

  const value = useMemo(
    () => ({ isOpen, pendingMessage, openChat, closeChat, consumePendingMessage }),
    [isOpen, pendingMessage, openChat, closeChat, consumePendingMessage]
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within ChatProvider')
  return ctx
}
