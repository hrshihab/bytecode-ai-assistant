// // USE IT IN FUTURE

// "use client"

// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Sparkles, X } from "lucide-react"

// interface ChatSidebarProps {
//   currentMode: any
//   modes: Record<string, any>
//   mode: string
//   onModeChange: (mode: string) => void
//   messagesByMode: Record<string, any[]>
//   quickActions: string[]
//   onQuickAction: (action: string) => void
//   isMobileMenuOpen: boolean
//   setIsMobileMenuOpen: (value: boolean) => void
// }

// export function ChatSidebar({
//   currentMode,
//   modes,
//   mode,
//   onModeChange,
//   messagesByMode,
//   quickActions,
//   onQuickAction,
//   isMobileMenuOpen,
//   setIsMobileMenuOpen,
// }: ChatSidebarProps) {
//   return (
//     <div
//       className={`
// fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200 dark:border-cyan-500/20 flex flex-col transform transition-all duration-300 ease-out overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-500 scrollbar-track-transparent
// ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
// `}
//     >
//       {/* Header */}
//       <div className="p-6 border-b border-gray-200 dark:border-cyan-500/20">
//         <div className="flex items-center space-x-4">
//           <div
//             className={`w-12 h-12 bg-gradient-to-br ${currentMode.gradient} rounded-2xl flex items-center justify-center shadow-lg ${currentMode.glow} shadow-2xl transform transition-all duration-300 hover:scale-105`}
//           >
//             <Sparkles className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
//               ByteCode
//             </h1>
//             <p className="text-xs text-gray-600 dark:text-gray-400">Futuristic AI Assistant</p>
//           </div>
//         </div>
//       </div>

//       <Button
//         variant="ghost"
//         size="sm"
//         onClick={() => setIsMobileMenuOpen(false)}
//         className="lg:hidden absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
//       >
//         <X className="w-4 h-4" />
//       </Button>

//       <Separator className="bg-gray-200 dark:bg-cyan-500/20" />

//       {/* Mode Selector */}
//       <div className="p-4">
//         <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">Modes</h3>
//         <div className="space-y-1">
//           {Object.entries(modes).map(([key, modeData]) => {
//             const ModeIcon = modeData.icon
//             const isActive = mode === key
//             const modeMessages = messagesByMode[key]?.length || 0
//             return (
//               <button
//                 key={key}
//                 onClick={() => onModeChange(key)}
//                 className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//                   isActive
//                     ? `${modeData.bg} ${modeData.color} ${modeData.border} border shadow-lg ${modeData.glow}`
//                     : "text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50"
//                 }`}
//               >
//                 <div className="flex items-center space-x-3">
//                   <ModeIcon className="w-4 h-4" />
//                   <span>{modeData.label}</span>
//                 </div>
//                 {modeMessages > 0 && (
//                   <Badge
//                     variant="secondary"
//                     className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
//                   >
//                     {modeMessages}
//                   </Badge>
//                 )}
//               </button>
//             )
//           })}
//         </div>
//       </div>

//       <Separator className="bg-gray-200 dark:bg-cyan-500/20" />

//       {/* Quick Actions */}
//       <div className="p-4 flex-1">
//         <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
//           Quick Actions
//         </h3>
//         <div className="space-y-2">
//           {quickActions.map((action, index) => (
//             <button
//               key={index}
//               onClick={() => {
//                 onQuickAction(action)
//                 setIsMobileMenuOpen(false)
//               }}
//               className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
//             >
//               {action}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }
