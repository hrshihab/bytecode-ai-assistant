// // USE IT IN FUTURE

// "use client"

// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Menu, X, Sun, Moon, MessageCircle, Volume2, VolumeX, Trash2, Github, AlertCircle } from "lucide-react"

// interface ChatHeaderProps {
//   currentMode: any
//   darkMode: boolean
//   setDarkMode: (value: boolean) => void
//   messagesLength: number
//   voiceEnabled: boolean
//   setVoiceEnabled: (value: boolean) => void
//   onClearChat: () => void
//   isMobileMenuOpen: boolean
//   setIsMobileMenuOpen: (value: boolean) => void
//   error: string | null
//   onClearError: () => void
// }

// export function ChatHeader({
//   currentMode,
//   darkMode,
//   setDarkMode,
//   messagesLength,
//   voiceEnabled,
//   setVoiceEnabled,
//   onClearChat,
//   isMobileMenuOpen,
//   setIsMobileMenuOpen,
//   error,
//   onClearError,
// }: ChatHeaderProps) {
//   const CurrentModeIcon = currentMode.icon

//   const handleClearChat = () => {
//     if (window.confirm("Are you sure you want to clear this chat? This action cannot be undone.")) {
//       onClearChat()
//     }
//   }

//   return (
//     <>
//       {/* Chat Header */}
//       <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-cyan-500/20 px-3 sm:px-6 py-2 sm:py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 flex-shrink-0 p-1"
//             >
//               <Menu className="w-4 h-4" />
//             </Button>
//             <div
//               className={`p-1.5 sm:p-2 rounded-lg ${currentMode.bg} ${currentMode.border} border flex-shrink-0 shadow-lg ${currentMode.glow}`}
//             >
//               <CurrentModeIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${currentMode.color}`} />
//             </div>
//             <div className="min-w-0 flex-1">
//               <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
//                 {currentMode.label} Assistant
//               </h2>
//               <p className="text-xs text-gray-600 dark:text-gray-400 truncate hidden sm:block">
//                 {currentMode.description}
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setDarkMode(!darkMode)}
//               className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 p-1"
//               title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
//             >
//               {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
//             </Button>

//             <Badge
//               variant="secondary"
//               className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-cyan-500/30 hidden sm:inline-flex"
//             >
//               <MessageCircle className="w-3 h-3 mr-2" />
//               {messagesLength}
//             </Badge>

//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setVoiceEnabled(!voiceEnabled)}
//               className={`p-1 transition-colors ${voiceEnabled ? "text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300" : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"}`}
//               title={voiceEnabled ? "Disable voice responses" : "Enable voice responses"}
//             >
//               {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
//             </Button>

//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={handleClearChat}
//               disabled={messagesLength === 0}
//               className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
//               title="Clear chat history"
//             >
//               <Trash2 className="w-3.5 h-3.5" />
//             </Button>

//             <Button
//               variant="ghost"
//               size="sm"
//               className="text-gray-800 dark:text-gray-300 bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors p-2"
//               asChild
//               title="View on GitHub"
//             >
//               <a
//                 href="https://github.com/hrshihab"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-label="View on GitHub"
//               >
//                 <Github className="w-4 h-4" />
//               </a>
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Error Display */}
//       {error && (
//         <div className="bg-red-50 dark:bg-red-950/30 border-b border-red-200 dark:border-red-800/50 px-3 sm:px-6 py-2">
//           <div className="flex items-center space-x-2 text-red-800 dark:text-red-400">
//             <AlertCircle className="w-4 h-4 flex-shrink-0" />
//             <p className="text-sm flex-1">{error}</p>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={onClearError}
//               className="ml-auto text-red-800 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 flex-shrink-0"
//               title="Dismiss error"
//             >
//               <X className="w-3 h-3" />
//             </Button>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }
