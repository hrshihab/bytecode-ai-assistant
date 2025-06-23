// // USE IT IN FUTURE

// "use client"

// import { useEffect, useRef } from "react"
// import { User } from "lucide-react"
// import ReactMarkdown from "react-markdown"
// import { AIVisualization } from "@/components/ai-visualization"
// import type { Components } from "react-markdown"

// const MarkdownComponents: Components = {
//   h1: ({ children }) => (
//     <h1 className="text-base lg:text-lg font-semibold mb-2 lg:mb-3 text-gray-900 dark:text-gray-100">{children}</h1>
//   ),
//   h2: ({ children }) => (
//     <h2 className="text-sm lg:text-base font-semibold mb-1.5 lg:mb-2 text-gray-900 dark:text-gray-100">{children}</h2>
//   ),
//   h3: ({ children }) => (
//     <h3 className="text-xs lg:text-sm font-semibold mb-1.5 lg:mb-2 text-gray-900 dark:text-gray-100">{children}</h3>
//   ),
//   p: ({ children }) => (
//     <p className="mb-2 lg:mb-3 last:mb-0 text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
//       {children}
//     </p>
//   ),
//   ul: ({ children }) => (
//     <ul className="list-disc list-inside mb-2 lg:mb-3 space-y-1 text-sm lg:text-base text-gray-700 dark:text-gray-300">
//       {children}
//     </ul>
//   ),
//   ol: ({ children }) => (
//     <ol className="list-decimal list-inside mb-2 lg:mb-3 space-y-1 text-sm lg:text-base text-gray-700 dark:text-gray-300">
//       {children}
//     </ol>
//   ),
//   li: ({ children }) => <li className="text-sm lg:text-base text-gray-700 dark:text-gray-300">{children}</li>,
//   strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>,
//   em: ({ children }) => <em className="italic text-gray-700 dark:text-gray-300">{children}</em>,
//   code: ({ children, className }) => {
//     const isInline = !className?.includes("language-")
//     return isInline ? (
//       <code className="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs lg:text-sm font-mono text-cyan-700 dark:text-cyan-400 border border-gray-300 dark:border-gray-700">
//         {children}
//       </code>
//     ) : (
//       <code className="block bg-gray-200 dark:bg-gray-900 p-2 lg:p-3 rounded-lg text-xs lg:text-sm font-mono overflow-x-auto text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700">
//         {children}
//       </code>
//     )
//   },
//   pre: ({ children }) => (
//     <pre className="bg-gray-200 dark:bg-gray-900 p-2 lg:p-3 rounded-lg mb-2 lg:mb-3 overflow-x-auto border border-gray-300 dark:border-gray-700">
//       {children}
//     </pre>
//   ),
//   blockquote: ({ children, ...props }) => (
//     <blockquote
//       {...props}
//       className="border-l-4 border-cyan-500 pl-3 lg:pl-4 italic mb-2 lg:mb-3 text-sm lg:text-base text-gray-600 dark:text-gray-400"
//     >
//       {children}
//     </blockquote>
//   ),
//   a: ({ href, children }) => (
//     <a
//       href={href}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 underline"
//     >
//       {children}
//     </a>
//   ),
// }

// interface ChatMessagesProps {
//   messages: any[]
//   currentMode: any
//   mode: string
//   isLoading: boolean
//   isListening: boolean
//   quickActions: string[]
//   onQuickAction: (action: string) => void
// }

// export function ChatMessages({
//   messages,
//   currentMode,
//   mode,
//   isLoading,
//   isListening,
//   quickActions,
//   onQuickAction,
// }: ChatMessagesProps) {
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const CurrentModeIcon = currentMode.icon

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages])

//   const formatTime = (timestamp: number) => {
//     return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//   }

//   return (
//     <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-500 scrollbar-track-transparent">
//       <div className="max-w-4xl mx-auto px-2 sm:px-6 py-3 sm:py-6">
//         {messages.length === 0 && (
//           <>
//             <div className="text-center py-6 sm:py-10">
//               <div className="mb-8">
//                 <AIVisualization mode={mode} isActive={isLoading || isListening} />
//               </div>
//               <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
//                 {mode === "bff"
//                   ? "Hey bestie! What's on your mind? 💕"
//                   : `What can I help you ${mode === "general" ? "with" : `${mode === "creative" ? "create" : mode}`}?`}
//               </h3>
//               <p className="text-sm sm:text-base text-gray-700 dark:text-gray-400 max-w-md mx-auto px-2 sm:px-4">
//                 {mode === "bff"
//                   ? "I'm your GenZ bestie who speaks your language! Chat with me in any language and I'll vibe with you! ✨"
//                   : `I'm your ${currentMode.label.toLowerCase()} assistant. Ask me anything or use the quick actions to get started.`}
//               </p>
//             </div>
//             <div className="flex flex-wrap justify-center gap-2 px-2">
//               {quickActions.map((action, index) => (
//                 <button
//                   key={index}
//                   onClick={() => onQuickAction(action)}
//                   className="px-3 py-2 text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors border border-gray-300 dark:border-cyan-500/20 hover:border-gray-400 dark:hover:border-cyan-500/40"
//                 >
//                   {action}
//                 </button>
//               ))}
//             </div>
//           </>
//         )}

//         <div className="space-y-3 sm:space-y-5">
//           {messages.map((message) => (
//             <div
//               key={message.id}
//               className={`flex space-x-2 sm:space-x-3 ${message.role === "user" ? "justify-end" : ""}`}
//             >
//               {message.role === "assistant" && (
//                 <div
//                   className={`flex-shrink-0 w-8 h-8 rounded-lg ${currentMode.bg} ${currentMode.border} border flex items-center justify-center shadow-lg ${currentMode.glow}`}
//                 >
//                   <CurrentModeIcon className={`w-5 h-5 ${currentMode.color}`} />
//                 </div>
//               )}
//               <div
//                 className={`flex-1 max-w-[80%] sm:max-w-[85%] ${message.role === "user" ? "flex flex-col items-end" : "flex flex-col items-start"}`}
//               >
//                 <div
//                   className={`px-3 py-2 rounded-2xl ${
//                     message.role === "user"
//                       ? `bg-gradient-to-r ${currentMode.gradient} text-white max-w-full shadow-lg ${currentMode.glow}`
//                       : "bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-gray-100"
//                   }`}
//                 >
//                   {message.role === "user" ? (
//                     <div className="text-sm break-words">{message.content}</div>
//                   ) : (
//                     <div className="prose prose-sm max-w-none dark:prose-invert">
//                       <ReactMarkdown components={MarkdownComponents}>{message.content}</ReactMarkdown>
//                     </div>
//                   )}
//                 </div>
//                 <div
//                   className={`text-[10px] sm:text-xs text-gray-600 dark:text-gray-500 mt-0.5 sm:mt-1 ${message.role === "user" ? "text-right" : "text-left"}`}
//                 >
//                   {formatTime(message.createdAt ? new Date(message.createdAt).getTime() : Date.now())}
//                 </div>
//               </div>
//               {message.role === "user" && (
//                 <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
//                   <User className="w-5 h-5 text-white" />
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//         {isLoading && (
//           <div className="flex space-x-2 sm:space-x-3">
//             <div
//               className={`flex-shrink-0 w-8 h-8 rounded-lg ${currentMode.bg} ${currentMode.border} border flex items-center justify-center shadow-lg ${currentMode.glow}`}
//             >
//               <CurrentModeIcon className={`w-5 h-5 ${currentMode.color} animate-pulse`} />
//             </div>
//             <div className="flex-1">
//               <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 px-3 py-2 rounded-2xl">
//                 <div className="flex items-center space-x-2">
//                   <div className="flex space-x-1">
//                     <div className="w-1.5 h-1.5 bg-cyan-600 dark:bg-cyan-400 rounded-full animate-bounce" />
//                     <div
//                       className="w-1.5 h-1.5 bg-cyan-600 dark:bg-cyan-400 rounded-full animate-bounce"
//                       style={{ animationDelay: "0.1s" }}
//                     />
//                     <div
//                       className="w-1.5 h-1.5 bg-cyan-600 dark:bg-cyan-400 rounded-full animate-bounce"
//                       style={{ animationDelay: "0.2s" }}
//                     />
//                   </div>
//                   <span className="text-xs text-gray-700 dark:text-gray-400">ByteCode is thinking...</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       <div ref={messagesEndRef} />
//     </div>
//   )
// }
