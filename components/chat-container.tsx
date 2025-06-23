// // USE IT IN FUTURE

// "use client"

// import { useChat } from "@ai-sdk/react"
// import { useCallback, useMemo, useRef, useEffect } from "react"
// import { ChatMessages } from "./chat-messages"
// import { ChatInput } from "./chat-input"

// type Mode = "general" | "productivity" | "wellness" | "learning" | "creative" | "bff"
// type Provider = "groq" | "gemini" | "openai" | "claude"

// interface ChatContainerProps {
//   mode: Mode
//   provider: Provider
//   apiKeys: Record<string, string>
//   currentMode: any
//   quickActions: string[]
//   onQuickAction: (action: string) => void
//   isListening: boolean
//   isSpeaking: boolean
//   voiceEnabled: boolean
//   speakMessage: (text: string) => void
//   onVoiceInput: () => void
//   onStopSpeaking: () => void
//   onError: (error: string) => void
//   providers: Record<string, any>
//   isProviderMenuOpen: boolean
//   setIsProviderMenuOpen: (value: boolean) => void
//   onProviderChange: (provider: string) => void
//   messages: any[]
//   onMessagesChange: (messages: any[]) => void
//   onClearMessages: () => void
// }

// export function ChatContainer({
//   mode,
//   provider,
//   apiKeys,
//   currentMode,
//   quickActions,
//   onQuickAction,
//   isListening,
//   isSpeaking,
//   voiceEnabled,
//   speakMessage,
//   onVoiceInput,
//   onStopSpeaking,
//   onError,
//   providers,
//   isProviderMenuOpen,
//   setIsProviderMenuOpen,
//   onProviderChange,
//   messages: externalMessages,
//   onMessagesChange,
//   onClearMessages,
// }: ChatContainerProps) {
//   // Stable chat configuration without problematic callbacks
//   const chatConfig = useMemo(
//     () => ({
//       api: "/api/chat",
//       body: {
//         mode,
//         provider,
//         ...(providers[provider].requiresApiKey && provider === "openai" && apiKeys.openai
//           ? { apiKey: apiKeys.openai }
//           : provider === "claude" && apiKeys.claude
//             ? { apiKey: apiKeys.claude }
//             : {}),
//       },
//       onError: (error: Error) => {
//         console.error("Chat error details:", error)
//         const errorMessage = error.message || "Failed to send message. Please try again."
//         onError(errorMessage)

//         // If it's an API key error, suggest setting up the API key
//         if (errorMessage.includes("API configuration error") || errorMessage.includes("API key")) {
//           onError(`${errorMessage} Please set up your ${providers[provider].name} API key.`)
//         }
//       },
//     }),
//     [mode, provider, apiKeys.openai, apiKeys.claude, providers, onError],
//   )

//   const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, setMessages } = useChat(chatConfig)

//   // Sync external messages with internal messages
//   useEffect(() => {
//     if (externalMessages.length !== messages.length) {
//       setMessages(externalMessages)
//     }
//   }, [externalMessages, messages.length, setMessages])

//   // Update external messages when internal messages change
//   useEffect(() => {
//     if (messages.length > 0 && messages !== externalMessages) {
//       onMessagesChange(messages)
//     }
//   }, [messages, externalMessages, onMessagesChange])

//   // Handle voice synthesis separately without causing re-renders
//   const lastMessageRef = useRef<string>("")

//   // Check for new assistant messages and speak them
//   useEffect(() => {
//     if (messages.length > 0) {
//       const lastMessage = messages[messages.length - 1]
//       if (
//         lastMessage.role === "assistant" &&
//         lastMessage.content !== lastMessageRef.current &&
//         voiceEnabled &&
//         !isLoading
//       ) {
//         lastMessageRef.current = lastMessage.content
//         // Use setTimeout to avoid blocking render
//         setTimeout(() => {
//           speakMessage(lastMessage.content)
//         }, 100)
//       }
//     }
//   }, [messages, voiceEnabled, isLoading, speakMessage])

//   const handleQuickActionClick = useCallback(
//     (action: string) => {
//       setInput(action)
//       onQuickAction(action)
//     },
//     [setInput, onQuickAction],
//   )

//   const handleClearChat = useCallback(() => {
//     setMessages([])
//     onClearMessages()
//   }, [setMessages, onClearMessages])

//   return (
//     <>
//       <ChatMessages
//         messages={messages}
//         currentMode={currentMode}
//         mode={mode}
//         isLoading={isLoading}
//         isListening={isListening}
//         quickActions={quickActions}
//         onQuickAction={handleQuickActionClick}
//       />
//       <ChatInput
//         input={input}
//         onInputChange={handleInputChange}
//         onSubmit={handleSubmit}
//         isLoading={isLoading}
//         isListening={isListening}
//         isSpeaking={isSpeaking}
//         onVoiceInput={onVoiceInput}
//         onStopSpeaking={onStopSpeaking}
//         currentMode={currentMode}
//         provider={provider}
//         providers={providers}
//         apiKeys={apiKeys}
//         isProviderMenuOpen={isProviderMenuOpen}
//         setIsProviderMenuOpen={setIsProviderMenuOpen}
//         onProviderChange={onProviderChange}
//       />
//     </>
//   )
// }
