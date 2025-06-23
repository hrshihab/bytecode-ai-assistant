// // USE IT IN FUTURE

// "use client"

// import type React from "react"

// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Mic, MicOff, ArrowUp, VolumeX, Cpu, ChevronDown, Key, Check } from "lucide-react"

// interface ChatInputProps {
//   input: string
//   onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
//   onSubmit: (e: React.FormEvent) => void
//   isLoading: boolean
//   isListening: boolean
//   isSpeaking: boolean
//   onVoiceInput: () => void
//   onStopSpeaking: () => void
//   currentMode: any
//   provider: string
//   providers: Record<string, any>
//   apiKeys: Record<string, string>
//   isProviderMenuOpen: boolean
//   setIsProviderMenuOpen: (value: boolean) => void
//   onProviderChange: (provider: string) => void
// }

// export function ChatInput({
//   input,
//   onInputChange,
//   onSubmit,
//   isLoading,
//   isListening,
//   isSpeaking,
//   onVoiceInput,
//   onStopSpeaking,
//   currentMode,
//   provider,
//   providers,
//   apiKeys,
//   isProviderMenuOpen,
//   setIsProviderMenuOpen,
//   onProviderChange,
// }: ChatInputProps) {
//   return (
//     <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-cyan-500/20 p-2 sm:p-4">
//       <div className="max-w-4xl mx-auto">
//         <form onSubmit={onSubmit} className="relative">
//           <Textarea
//             value={input}
//             onChange={onInputChange}
//             placeholder={currentMode.placeholder}
//             className="min-h-[40px] sm:min-h-[50px] max-h-28 resize-none bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm border-gray-300 dark:border-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-500 focus:border-cyan-500/50 focus:ring-0 pr-20 sm:pr-24 text-xs sm:text-sm"
//             onKeyDown={(e) => {
//               if (e.key === "Enter" && !e.shiftKey) {
//                 e.preventDefault()
//                 onSubmit(e as any)
//               }
//             }}
//           />
//           <div className="absolute right-1.5 bottom-1.5 flex items-center space-x-1">
//             {isSpeaking && (
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="sm"
//                 onClick={onStopSpeaking}
//                 className="text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 p-2 rounded-xl"
//               >
//                 <VolumeX className="w-4 h-4" />
//               </Button>
//             )}
//             <Button
//               type="button"
//               variant="ghost"
//               size="sm"
//               onClick={onVoiceInput}
//               className={`rounded-xl p-2 transition-all duration-200 ${
//                 isListening
//                   ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 animate-pulse"
//                   : "text-gray-600 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
//               }`}
//               disabled={isLoading}
//             >
//               {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
//             </Button>
//             <Button
//               type="submit"
//               size="sm"
//               disabled={isLoading || !input.trim()}
//               className={`bg-gradient-to-r ${currentMode.gradient} hover:opacity-90 text-white rounded-xl p-2 shadow-lg ${currentMode.glow} disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-xl`}
//             >
//               <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
//             </Button>
//           </div>
//         </form>

//         {/* Model selector */}
//         <div className="flex items-center justify-between mt-2 text-[10px] sm:text-xs text-gray-600 dark:text-gray-500">
//           <span className="hidden sm:inline">Press Enter to send, Shift+Enter for new line</span>
//           <span className="sm:hidden">Tap to send</span>

//           <div className="flex items-center space-x-3">
//             <div className="flex items-center space-x-2">
//               <span className={`${currentMode.color} font-medium`}>{currentMode.label}</span>
//             </div>

//             <div className="flex items-center space-x-2 border-l border-gray-300 dark:border-gray-700 pl-3">
//               <Cpu className="w-3 h-3 text-gray-600 dark:text-gray-400" />

//               {/* Custom Provider Dropdown */}
//               <div className="relative" data-provider-menu="true">
//                 <button
//                   onClick={() => setIsProviderMenuOpen(!isProviderMenuOpen)}
//                   className="h-6 px-2 text-xs flex items-center gap-1 font-medium rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                 >
//                   <span
//                     className={`${
//                       provider === "groq"
//                         ? "text-cyan-700 dark:text-cyan-400"
//                         : provider === "gemini"
//                           ? "text-emerald-700 dark:text-emerald-400"
//                           : provider === "openai"
//                             ? "text-violet-700 dark:text-violet-400"
//                             : "text-orange-700 dark:text-orange-400"
//                     }`}
//                   >
//                     {providers[provider].name}
//                   </span>
//                   <ChevronDown className="w-3 h-3" />
//                 </button>

//                 {isProviderMenuOpen && (
//                   <div className="absolute right-0 bottom-full mb-1 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
//                     {Object.entries(providers).map(([key, providerData]) => (
//                       <button
//                         key={key}
//                         onClick={() => onProviderChange(key)}
//                         className="flex items-center justify-between w-full px-3 py-1.5 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
//                       >
//                         <span className={`${key === provider ? "font-medium" : ""}`}>{providerData.name}</span>
//                         {key === provider ? (
//                           <Check className="w-3 h-3" />
//                         ) : (
//                           providerData.requiresApiKey &&
//                           ((key === "openai" && !apiKeys.openai) || (key === "claude" && !apiKeys.claude)) && (
//                             <Key className="w-3 h-3 text-gray-400" />
//                           )
//                         )}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
