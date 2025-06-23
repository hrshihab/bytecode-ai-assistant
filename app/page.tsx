"use client"

import { useChat } from "@ai-sdk/react"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Brain,
  Heart,
  BookOpen,
  Lightbulb,
  User,
  Target,
  MessageCircle,
  Trash2,
  Mic,
  MicOff,
  ArrowUp,
  Sparkles,
  Github,
  Menu,
  X,
  Volume2,
  VolumeX,
  Users,
  Sun,
  Moon,
  Cpu,
  AlertCircle,
  ChevronDown,
  Key,
  Check,
  Gamepad2,
  Palette,
  Plus,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import { AIVisualization } from "@/components/ai-visualization"
import { ActivityMatrix } from "@/components/activity-matrix"
import { useSpeech } from "@/hooks/use-speech"
import "../styles/globals.css"

type Mode = "general"
type Provider = "groq" | "gemini" | "openai" | "claude"
type UIStyle = "modern" | "pixel"

const MODES = {
  general: {
    icon: Brain,
    label: "ByteCode Assistant",
    description: "Your ByteCode AI assistant for software solutions, innovation, and support.",
    placeholder: "How can ByteCode help you today?",
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-100/50 dark:bg-cyan-950/30",
    bgPixel: "bg-cyan-100 dark:bg-cyan-900/30",
    border: "border-cyan-300 dark:border-cyan-500/30",
    borderPixel: "border-cyan-400 dark:border-cyan-500",
    gradient: "from-cyan-500 to-blue-600",
    glow: "shadow-cyan-500/20",
  },
}

const PROVIDERS = {
  groq: {
    name: "Groq",
    description: "Fast and efficient LLM",
    models: ["llama-3.1-8b-instant", "llama-3.3-70b-versatile", "qwen/qwen3-32b"],
    requiresApiKey: false,
    color: "pink",
  },
  gemini: {
    name: "Gemini",
    description: "Google's multimodal AI",
    models: ["gemini-2.0-flash"],
    requiresApiKey: false,
    color: "emerald",
  },
  openai: {
    name: "OpenAI",
    description: "Advanced language models",
    models: ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"],
    requiresApiKey: true,
    color: "violet",
  },
  claude: {
    name: "Claude",
    description: "Anthropic's helpful assistant",
    models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
    requiresApiKey: true,
    color: "orange",
  },
}

const QUICK_ACTIONS = {
  general: [
    "Tell me about ByteCode's services",
    "How can ByteCode help my business?",
    "What technologies does ByteCode use?",
    "Contact ByteCode support",
  ],
}

import type { Components } from "react-markdown"

export default function ByteCodeAssistant() {
  const [mode, setMode] = useState<Mode>("general")
  const [provider, setProvider] = useState<Provider>("groq")
  const [darkMode, setDarkMode] = useState(false)
  const [uiStyle, setUIStyle] = useState<UIStyle>("modern")
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<Provider>("groq")
  const [tempApiKey, setTempApiKey] = useState("")
  const [isProviderMenuOpen, setIsProviderMenuOpen] = useState(false)

  // Dynamic Markdown Components based on UI style
  const MarkdownComponents: Components = useMemo(
    () => ({
      h1: ({ children }) => (
        <h1
          className={`text-base lg:text-lg mb-2 lg:mb-3 text-gray-900 dark:text-gray-100 ${uiStyle === "pixel" ? "text-xs lg:text-sm font-bold pixel-font" : "font-semibold"}`}
        >
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2
          className={`text-sm lg:text-base mb-1.5 lg:mb-2 text-gray-900 dark:text-gray-100 ${uiStyle === "pixel" ? "text-xs lg:text-xs font-bold pixel-font" : "font-semibold"}`}
        >
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3
          className={`text-xs lg:text-sm mb-1.5 lg:mb-2 text-gray-900 dark:text-gray-100 ${uiStyle === "pixel" ? "text-xs lg:text-xs font-bold pixel-font" : "font-semibold"}`}
        >
          {children}
        </h3>
      ),
      p: ({ children }) => (
        <p
          className={`mb-2 lg:mb-3 last:mb-0 text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed ${uiStyle === "pixel" ? "text-xs lg:text-xs pixel-font" : ""}`}
        >
          {children}
        </p>
      ),
      ul: ({ children }) => (
        <ul
          className={`mb-2 lg:mb-3 space-y-1 text-sm lg:text-base text-gray-700 dark:text-gray-300 ${uiStyle === "pixel" ? "list-none text-xs lg:text-xs pixel-font" : "list-disc list-inside"}`}
        >
          {children}
        </ul>
      ),
      ol: ({ children }) => (
        <ol
          className={`mb-2 lg:mb-3 space-y-1 text-sm lg:text-base text-gray-700 dark:text-gray-300 ${uiStyle === "pixel" ? "list-none text-xs lg:text-xs pixel-font" : "list-decimal list-inside"}`}
        >
          {children}
        </ol>
      ),
      li: ({ children }) => (
        <li
          className={`text-sm lg:text-base text-gray-700 dark:text-gray-300 ${uiStyle === "pixel" ? 'text-xs lg:text-xs pixel-font before:content-["▶_"] before:text-cyan-600 dark:before:text-cyan-400' : ""}`}
        >
          {children}
        </li>
      ),
      strong: ({ children }) => (
        <strong
          className={`text-gray-900 dark:text-gray-100 ${uiStyle === "pixel" ? "font-bold pixel-font" : "font-semibold"}`}
        >
          {children}
        </strong>
      ),
      em: ({ children }) => (
        <em className={`italic text-gray-700 dark:text-gray-300 ${uiStyle === "pixel" ? "pixel-font" : ""}`}>
          {children}
        </em>
      ),
      code: ({ children, className }) => {
        const isInline = !className?.includes("language-")
        return isInline ? (
          <code
            className={`px-1.5 py-0.5 text-xs lg:text-sm font-mono text-cyan-700 dark:text-cyan-400 ${uiStyle === "pixel"
              ? "bg-gray-300 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 pixel-border pixel-font px-2 py-1 text-gray-900 dark:text-gray-100"
              : "bg-gray-200 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700"
              }`}
          >
            {children}
          </code>
        ) : (
          <code
            className={`block p-2 lg:p-3 text-xs lg:text-sm font-mono overflow-x-auto ${uiStyle === "pixel"
              ? "bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-2 border-gray-400 dark:border-gray-600 pixel-border"
              : "bg-gray-200 dark:bg-gray-900 rounded-lg text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700"
              }`}
          >
            {children}
          </code>
        )
      },
      pre: ({ children }) => (
        <pre
          className={`p-2 lg:p-3 mb-2 lg:mb-3 overflow-x-auto ${uiStyle === "pixel"
            ? "bg-gray-200 dark:bg-gray-900 border-2 border-gray-400 dark:border-gray-600 pixel-border"
            : "bg-gray-200 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700"
            }`}
        >
          {children}
        </pre>
      ),
      blockquote: ({ children, ...props }) => (
        <blockquote
          {...props}
          className={`border-l-4 border-cyan-500 pl-3 lg:pl-4 italic mb-2 lg:mb-3 text-sm lg:text-base text-gray-600 dark:text-gray-400 ${uiStyle === "pixel" ? "pixel-font border-cyan-600 dark:border-cyan-400" : ""}`}
        >
          {children}
        </blockquote>
      ),
      a: ({ href, children }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 underline ${uiStyle === "pixel" ? "pixel-font" : ""}`}
        >
          {children}
        </a>
      ),
    }),
    [uiStyle],
  )

  // Use the speech hook
  const {
    isListening,
    isSpeaking,
    voiceEnabled,
    error: speechError,
    setVoiceEnabled,
    speakMessage,
    stopSpeaking,
    startListening,
    clearError: clearSpeechError,
  } = useSpeech()

  // Stable API keys state
  const [apiKeys, setApiKeys] = useState(() => ({
    openai: "",
    claude: "",
  }))

  // Separate message states for each mode - use ref to avoid dependency issues
  const messagesByModeRef = useRef<Record<Mode, any[]>>({
    general: []
    
  })

  // Current mode ref to avoid stale closures
  const currentModeRef = useRef<Mode>(mode)
  currentModeRef.current = mode

  // Memoize the current API key to prevent unnecessary re-renders
  const currentApiKey = useMemo(() => {
    if (!PROVIDERS[provider].requiresApiKey) return ""
    return provider === "openai" ? apiKeys.openai : provider === "claude" ? apiKeys.claude : ""
  }, [provider, apiKeys])

  // Stable chat configuration - memoized to prevent infinite loops
  const chatConfig = useMemo(
    () => ({
      api: "/api/chat",
      experimental_throttle: 50, // Throttle UI updates to prevent infinite loops
      body: {
        mode,
        provider,
        ...(PROVIDERS[provider].requiresApiKey && provider === "openai" && apiKeys.openai
          ? { apiKey: apiKeys.openai }
          : provider === "claude" && apiKeys.claude
            ? { apiKey: apiKeys.claude }
            : {}),
      },
      onError: (error: Error) => {
        console.error("Chat error details:", error)
        const errorMessage = error.message || "Failed to send message. Please try again."
        setError(errorMessage)

        // If it's an API key error, suggest setting up the API key
        if (errorMessage.includes("API configuration error") || errorMessage.includes("API key")) {
          setError(`${errorMessage} Please set up your ${PROVIDERS[provider].name} API key.`)
        }
      },
      onFinish: (message: any) => {
        setError(null)
        if (voiceEnabled && message.content) {
          speakMessage(message.content)
        }
      },
    }),
    [mode, provider, apiKeys.openai, apiKeys.claude, voiceEnabled, speakMessage],
  )

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, setInput } = useChat(chatConfig)

  // Update messages by mode when messages change - use useCallback to prevent infinite loops
  const updateMessagesByMode = useCallback(() => {
    if (messages.length > 0) {
      messagesByModeRef.current[currentModeRef.current] = [...messages]
    }
  }, [messages])

  useEffect(() => {
    updateMessagesByMode()
  }, [updateMessagesByMode])

  // Apply theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Load API keys from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedApiKeys = localStorage.getItem("bytecode-api-keys")
      if (savedApiKeys) {
        try {
          const parsedKeys = JSON.parse(savedApiKeys)
          setApiKeys(parsedKeys)
        } catch (e) {
          console.error("Failed to parse saved API keys:", e)
        }
      }
    }
  }, [])

  // Combine errors
  const combinedError = error || speechError

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleQuickAction = useCallback(
    (action: string) => {
      setInput(action)
      setError(null)
      clearSpeechError()
    },
    [setInput, clearSpeechError],
  )

  const clearChat = useCallback(() => {
    setMessages([])
    messagesByModeRef.current[currentModeRef.current] = []
    setError(null)
    clearSpeechError()
    stopSpeaking()
  }, [setMessages, clearSpeechError, stopSpeaking])

  const handleVoiceInput = useCallback(() => {
    startListening((transcript: string) => {
      setInput(transcript)
    })
  }, [startListening, setInput])

  // Handle mode change - load messages for the new mode
  const handleModeChange = useCallback(
    (newMode: Mode) => {
      if (newMode === mode) return // Don't update if mode hasn't changed

      // Save current messages to current mode
      messagesByModeRef.current[currentModeRef.current] = [...messages]

      // Switch to new mode
      setMode(newMode)
      setError(null)
      clearSpeechError()
      setIsMobileMenuOpen(false)

      // Set messages for new mode
      const newModeMessages = messagesByModeRef.current[newMode] || []
      setMessages(newModeMessages)
    },
    [messages, setMessages, mode, clearSpeechError],
  )

  // Handle provider change
  const handleProviderChange = useCallback(
    (newProvider: Provider) => {
      // Close the provider menu
      setIsProviderMenuOpen(false)

      // Check if API key is required and available
      if (PROVIDERS[newProvider].requiresApiKey) {
        const hasApiKey = newProvider === "openai" ? apiKeys.openai : newProvider === "claude" ? apiKeys.claude : false
        if (!hasApiKey) {
          setSelectedProvider(newProvider)
          setTempApiKey("")
          setIsApiKeyDialogOpen(true)
          return
        }
      }

      setProvider(newProvider)
      setError(null)
      clearSpeechError()
    },
    [apiKeys, clearSpeechError],
  )

  // Handle API key save
  const handleSaveApiKey = useCallback(() => {
    if (!tempApiKey.trim()) {
      setIsApiKeyDialogOpen(false)
      return
    }

    // Update API keys
    const updatedApiKeys = {
      ...apiKeys,
      [selectedProvider]: tempApiKey.trim(),
    }
    setApiKeys(updatedApiKeys)

    // Save API keys to localStorage
    localStorage.setItem("bytecode-api-keys", JSON.stringify(updatedApiKeys))

    // Switch to the selected provider
    setProvider(selectedProvider)
    setError(null)
    clearSpeechError()
    setIsApiKeyDialogOpen(false)
    setTempApiKey("")
  }, [apiKeys, selectedProvider, tempApiKey, clearSpeechError])

  const modeKey = 'general';
  const modeData = MODES[modeKey];
  const currentMode = useMemo(() => MODES[modeKey], [modeKey]);
  const CurrentModeIcon = currentMode.icon;

  const formatTime = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }, [])

  // Close provider menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isProviderMenuOpen && !target.closest('[data-provider-menu="true"]')) {
        setIsProviderMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isProviderMenuOpen])

  return (
    <div
      className={`h-screen overflow-hidden transition-colors duration-200 ${uiStyle === "pixel"
        ? "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pixel-font"
        : "bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100"
        }`}
    >
      <div className="flex h-full">
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Left Sidebar */}
        <div
          className={`
fixed lg:relative inset-y-0 left-0 z-50 w-80 flex flex-col transform transition-all duration-300 ease-out overflow-y-auto ${uiStyle === "pixel"
              ? "bg-gray-200 dark:bg-gray-800 border-r-4 border-gray-400 dark:border-gray-600 pixel-border"
              : "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200 dark:border-cyan-500/20 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-500 scrollbar-track-transparent"
            }
${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
`}
        >

               {/* Header */}
               <div
            className={`p-5 ${uiStyle === "pixel"
              ? "border-b-4 border-gray-400 dark:border-gray-600"
              : "border-b border-gray-200 dark:border-cyan-500/20"
              }`}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${currentMode.gradient} flex items-center justify-center shadow-lg ${currentMode.glow} shadow-2xl transform transition-all duration-300 hover:scale-105 ${uiStyle === "pixel" ? `border-4 ${currentMode.borderPixel} pixel-border` : "rounded-2xl"
                  }`}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  className={`text-lg font-bold ${uiStyle === "pixel"
                    ? "text-gray-900 dark:text-gray-100 pixel-font"
                    : "bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent"
                    }`}
                >
                  BYTECODE
                </h1>
                <p className={`text-xs text-gray-600 dark:text-gray-400 ${uiStyle === "pixel" ? "pixel-font" : ""}`}>
                  {uiStyle === "pixel" ? "AI Assistant v2.0" : "Futuristic AI Assistant"}
                </p>
              </div>
            </div>
          </div>
          {/* New Chat Button at the very top */}
          <button
            onClick={() => {
              clearChat();
              setIsMobileMenuOpen(false);
            }}
            className='relative inline-flex h-12 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-50 w-[calc(100%-2rem)] m-4'
            type='button'
          >
            <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#67e8f9_0%,#2563eb_50%,#67e8f9_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#a2e4ff_0%,#2563eb_50%,#a2e4ff_100%)]' />
            <span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full dark:bg-[#070e41] bg-[#ffffff] px-8 py-1 text-base font-semibold dark:text-gray-50 text-black backdrop-blur-3xl gap-2'>
              <Plus className='w-5 h-5' /> New Chat
            </span>
          </button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`lg:hidden absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 ${uiStyle === "pixel" ? "border-2 border-gray-400 dark:border-gray-600 pixel-border pixel-font" : ""
              }`}
          >
            <X className="w-4 h-4" />
          </Button>

          <Separator
            className={`${uiStyle === "pixel" ? "bg-gray-400 dark:bg-gray-600 h-1" : "bg-gray-200 dark:bg-cyan-500/20"
              }`}
          />

          {/* Quick Actions */}
          <div className="p-4 flex-1">
            <h3
              className={`text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3 ${uiStyle === "pixel" ? "font-bold pixel-font" : ""
                }`}
            >
              {uiStyle === "pixel" ? "QUICK ACTIONS" : "Quick Actions"}
            </h3>
            <div className={uiStyle === "pixel" ? "space-y-2" : "space-y-2"}>
              {QUICK_ACTIONS[modeKey].map((action: string, index: number) => (
                <button
                  key={index}
                  onClick={() => {
                    handleQuickAction(action)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors ${uiStyle === "pixel"
                    ? "hover:bg-gray-300 dark:hover:bg-gray-700 border-2 border-gray-400 dark:border-gray-600 pixel-border pixel-font"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg"
                    }`}
                >
                  {uiStyle === "pixel" ? `▶ ${action}` : action}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div
            className={`flex-shrink-0 px-3 sm:px-6 py-2 sm:py-4 ${uiStyle === "pixel"
              ? "bg-gray-200 dark:bg-gray-800 border-b-4 border-gray-400 dark:border-gray-600"
              : "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-cyan-500/20"
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex-shrink-0 p-1 ${uiStyle === "pixel"
                    ? "hover:bg-gray-300 dark:hover:bg-gray-700 border-2 border-gray-400 dark:border-gray-600 pixel-border"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800/50"
                    }`}
                >
                  <Menu className="w-4 h-4" />
                </Button>
                <div
                  className={`p-1.5 sm:p-2 flex-shrink-0 shadow-lg ${currentMode.glow} ${uiStyle === "pixel"
                    ? `${currentMode.bgPixel} ${currentMode.borderPixel} border-4 pixel-border`
                    : `rounded-lg ${currentMode.bg} ${currentMode.border} border`
                    }`}
                >
                  <CurrentModeIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${currentMode.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2
                    className={`text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate ${uiStyle === "pixel" ? "font-bold pixel-font" : ""
                      }`}
                  >
                    {uiStyle === "pixel"
                      ? `${currentMode.label.toUpperCase()} ASSISTANT`
                      : `${currentMode.label} Assistant`}
                  </h2>
                  <p
                    className={`text-xs text-gray-600 dark:text-gray-400 truncate hidden sm:block ${uiStyle === "pixel" ? "pixel-font" : ""
                      }`}
                  >
                    {currentMode.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                {/* UI Style Toggle Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUIStyle(uiStyle === "modern" ? "pixel" : "modern")}
                  className={`text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 p-1 transition-colors ${uiStyle === "pixel"
                    ? "hover:bg-gray-300 dark:hover:bg-gray-700 border-2 border-gray-400 dark:border-gray-600 pixel-border"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800/50"
                    }`}
                  title={`Switch to ${uiStyle === "modern" ? "Pixel" : "Modern"} UI`}
                >
                  {uiStyle === "modern" ? <Gamepad2 className="w-3.5 h-3.5" /> : <Palette className="w-3.5 h-3.5" />}
                </Button>

                {/* Theme Toggle Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDarkMode(!darkMode)}
                  className={`text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 p-1 ${uiStyle === "pixel"
                    ? "hover:bg-gray-300 dark:hover:bg-gray-700 border-2 border-gray-400 dark:border-gray-600 pixel-border"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800/50"
                    }`}
                >
                  {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                </Button>

                <Badge
                  variant="secondary"
                  className={`hidden sm:inline-flex ${uiStyle === "pixel"
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-2 border-gray-400 dark:border-gray-600 pixel-border pixel-font"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-cyan-500/30"
                    }`}
                >
                  <MessageCircle className="w-3 h-3 mr-2" />
                  {messages.length}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`p-1 transition-colors ${voiceEnabled
                    ? "text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    } ${uiStyle === "pixel"
                      ? `border-2 pixel-border ${voiceEnabled ? "border-cyan-400 dark:border-cyan-500" : "border-gray-400 dark:border-gray-600"}`
                      : ""
                    }`}
                >
                  {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  disabled={messages.length === 0}
                  className={`text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 p-1 disabled:opacity-50 ${uiStyle === "pixel"
                    ? "hover:bg-gray-300 dark:hover:bg-gray-700 border-2 border-gray-400 dark:border-gray-600 pixel-border"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800/50"
                    }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-gray-800 dark:text-gray-300 transition-colors p-2 ${uiStyle === "pixel"
                    ? "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 border-2 border-gray-400 dark:border-gray-600 pixel-border"
                    : "bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                    }`}
                  asChild
                >
                  <a
                    href="https://github.com/hrshihab"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View on GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {combinedError && (
            <div
              className={`px-3 sm:px-6 py-2 ${uiStyle === "pixel"
                ? "bg-red-200 dark:bg-red-900/30 border-b-4 border-red-400 dark:border-red-600"
                : "bg-red-50 dark:bg-red-950/30 border-b border-red-200 dark:border-red-800/50"
                }`}
            >
              <div className="flex items-center space-x-2 text-red-800 dark:text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p className={`text-sm ${uiStyle === "pixel" ? "pixel-font" : ""}`}>
                  {uiStyle === "pixel" ? "ERROR: " : ""}
                  {combinedError}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setError(null)
                    clearSpeechError()
                  }}
                  className={`ml-auto text-red-800 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 ${uiStyle === "pixel" ? "border-2 border-red-400 dark:border-red-600 pixel-border" : ""
                    }`}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div
            className={`flex-1 overflow-y-auto ${uiStyle === "pixel"
              ? "bg-gray-50 dark:bg-gray-950"
              : "bg-gray-50 dark:bg-gray-950 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-500 scrollbar-track-transparent"
              }`}
          >
            <div className="max-w-4xl mx-auto px-2 sm:px-6 py-3 sm:py-6">
              {messages.length === 0 && (
                <>
                  <div className="text-center py-6 sm:py-10">
                    <div className="mb-8">
                      <AIVisualization mode={mode} isActive={isLoading || isListening} />
                    </div>
                    <h3
                      className={`text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 ${uiStyle === "pixel" ? "font-bold pixel-font" : ""
                        }`}
                    >
                      {uiStyle === "pixel"
                        ? `WHAT CAN I HELP YOU WITH?`
                        : `What can I help you with?`}
                    </h3>
                    <p
                      className={`text-sm sm:text-base text-gray-700 dark:text-gray-400 max-w-md mx-auto px-2 sm:px-4 ${uiStyle === "pixel" ? "pixel-font" : ""
                        }`}
                    >
                      {`I'm your ${currentMode.label.toLowerCase()} assistant. Ask me anything or use the quick actions to get started.`}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 px-2">
                    {QUICK_ACTIONS[modeKey].map((action: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action)}
                        className={`px-3 py-2 text-sm text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors ${uiStyle === "pixel"
                          ? "hover:bg-gray-300 dark:hover:bg-gray-700 border-2 border-gray-400 dark:border-gray-600 pixel-border pixel-font"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg border border-gray-300 dark:border-cyan-500/20 hover:border-gray-400 dark:hover:border-cyan-500/40"
                          }`}
                      >
                        {uiStyle === "pixel" ? `▶ ${action}` : action}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="space-y-3 sm:space-y-5">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex space-x-2 sm:space-x-3 ${message.role === "user" ? "justify-end" : ""}`}
                  >
                    {message.role === "assistant" && (
                      <div
                        className={`flex-shrink-0 w-8 h-8 flex items-center justify-center shadow-lg ${currentMode.glow} ${uiStyle === "pixel"
                          ? `${currentMode.bgPixel} ${currentMode.borderPixel} border-4 pixel-border`
                          : `rounded-lg ${currentMode.bg} ${currentMode.border} border`
                          }`}
                      >
                        <CurrentModeIcon className={`w-5 h-5 ${currentMode.color}`} />
                      </div>
                    )}
                    <div
                      className={`flex-1 max-w-[80%] sm:max-w-[85%] ${message.role === "user" ? "flex flex-col items-end" : "flex flex-col items-start"}`}
                    >
                      <div
                        className={`px-3 py-2 ${message.role === "user"
                          ? `bg-gradient-to-r ${currentMode.gradient} text-white max-w-full shadow-lg ${currentMode.glow} ${uiStyle === "pixel" ? `${currentMode.borderPixel} border-4 pixel-border` : "rounded-2xl"
                          }`
                          : `text-gray-900 dark:text-gray-100 ${uiStyle === "pixel"
                            ? "bg-white dark:bg-gray-800 border-4 border-gray-400 dark:border-gray-600 pixel-border"
                            : "bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-2xl"
                          }`
                          }`}
                      >
                        {message.role === "user" ? (
                          <div className={`text-sm break-words ${uiStyle === "pixel" ? "pixel-font font-bold" : ""}`}>
                            {message.content}
                          </div>
                        ) : (
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown components={MarkdownComponents}>{message.content}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                      <div
                        className={`text-[10px] sm:text-xs text-gray-600 dark:text-gray-500 mt-0.5 sm:mt-1 ${message.role === "user" ? "text-right" : "text-left"
                          } ${uiStyle === "pixel" ? "pixel-font" : ""}`}
                      >
                        {uiStyle === "pixel" ? "[" : ""}
                        {formatTime(message.createdAt ? new Date(message.createdAt).getTime() : Date.now())}
                        {uiStyle === "pixel" ? "]" : ""}
                      </div>
                    </div>
                    {message.role === "user" && (
                      <div
                        className={`flex-shrink-0 w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ${uiStyle === "pixel" ? "border-4 border-cyan-400 pixel-border" : "rounded-lg"
                          }`}
                      >
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {isLoading && (
                <div className="flex space-x-2 sm:space-x-3">
                  <div
                    className={`flex-shrink-0 w-8 h-8 flex items-center justify-center shadow-lg ${currentMode.glow} ${uiStyle === "pixel"
                      ? `${currentMode.bgPixel} ${currentMode.borderPixel} border-4 pixel-border`
                      : `rounded-lg ${currentMode.bg} ${currentMode.border} border`
                      }`}
                  >
                    <CurrentModeIcon className={`w-5 h-5 ${currentMode.color} animate-pulse`} />
                  </div>
                  <div className="flex-1">
                    <div
                      className={`px-3 py-2 ${uiStyle === "pixel"
                        ? "bg-white dark:bg-gray-800 border-4 border-gray-400 dark:border-gray-600 pixel-border"
                        : "bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-2xl"
                        }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div
                            className={`bg-cyan-600 dark:bg-cyan-400 animate-bounce ${uiStyle === "pixel" ? "w-2 h-2 pixel-border" : "w-1.5 h-1.5 rounded-full"
                              }`}
                          />
                          <div
                            className={`bg-cyan-600 dark:bg-cyan-400 animate-bounce ${uiStyle === "pixel" ? "w-2 h-2 pixel-border" : "w-1.5 h-1.5 rounded-full"
                              }`}
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className={`bg-cyan-600 dark:bg-cyan-400 animate-bounce ${uiStyle === "pixel" ? "w-2 h-2 pixel-border" : "w-1.5 h-1.5 rounded-full"
                              }`}
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                        <span
                          className={`text-xs text-gray-700 dark:text-gray-400 ${uiStyle === "pixel" ? "pixel-font" : ""}`}
                        >
                          {uiStyle === "pixel" ? "BYTECODE IS PROCESSING..." : "ByteCode is thinking..."}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className={`flex-shrink-0 p-2 sm:p-4 ${uiStyle === "pixel"
              ? "bg-gray-200 dark:bg-gray-800 border-t-4 border-gray-400 dark:border-gray-600"
              : "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-cyan-500/20"
              }`}
          >
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="relative">
                <Textarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder={uiStyle === "pixel" ? `> ${currentMode.placeholder}` : currentMode.placeholder}
                  className={`min-h-[50px] sm:min-h-[60px] max-h-32 resize-none text-gray-900 dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-500 focus:ring-0 pr-20 sm:pr-24 text-base sm:text-lg leading-relaxed ${uiStyle === "pixel"
                    ? "bg-gray-100 dark:bg-gray-900 border-4 border-gray-400 dark:border-gray-600 focus:border-cyan-500 dark:focus:border-cyan-400 pixel-font pixel-border"
                    : "bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm border-gray-300 dark:border-gray-700/50 focus:border-cyan-500/50"
                    }`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e as any)
                    }
                  }}
                />
                <div className="absolute right-1.5 bottom-1.5 flex items-center space-x-1">
                  {isSpeaking && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={stopSpeaking}
                      className={`text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-2 ${uiStyle === "pixel"
                        ? "hover:bg-red-200 dark:hover:bg-red-900/30 border-2 border-red-400 dark:border-red-600 pixel-border"
                        : "hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl"
                        }`}
                    >
                      <VolumeX className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleVoiceInput}
                    className={`p-2 transition-all duration-200 ${isListening
                      ? `text-red-700 dark:text-red-400 animate-pulse ${uiStyle === "pixel"
                        ? "bg-red-200 dark:bg-red-900/30 hover:bg-red-300 dark:hover:bg-red-800/40 border-4 border-red-400 dark:border-red-600 pixel-border"
                        : "bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl"
                      }`
                      : `text-gray-600 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 ${uiStyle === "pixel"
                        ? "hover:bg-gray-300 dark:hover:bg-gray-700 border-4 border-gray-400 dark:border-gray-600 pixel-border"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl"
                      }`
                      }`}
                    disabled={isLoading}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isLoading || !input.trim()}
                    className={`bg-gradient-to-r ${currentMode.gradient} hover:opacity-90 text-white p-2 shadow-lg ${currentMode.glow} disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-xl ${uiStyle === "pixel" ? `border-4 ${currentMode.borderPixel} pixel-border` : "rounded-xl"
                      }`}
                  >
                    <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
              </form>

              {/* Model selector */}
              <div
                className={`flex items-center justify-between mt-2 text-[10px] sm:text-xs text-gray-600 dark:text-gray-500 ${uiStyle === "pixel" ? "pixel-font" : ""
                  }`}
              >
                <span className="hidden sm:inline">
                  {uiStyle === "pixel"
                    ? "[ENTER] = SEND | [SHIFT+ENTER] = NEW LINE"
                    : "Press Enter to send, Shift+Enter for new line"}
                </span>
                <span className="sm:hidden">{uiStyle === "pixel" ? "[TAP TO SEND]" : "Tap to send"}</span>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className={`${currentMode.color} font-medium ${uiStyle === "pixel" ? "font-bold" : ""}`}>
                      {uiStyle === "pixel" ? currentMode.label.toUpperCase() : currentMode.label}
                    </span>
                  </div>

                  <div
                    className={`flex items-center space-x-2 pl-3 ${uiStyle === "pixel"
                      ? "border-l-2 border-gray-400 dark:border-gray-600"
                      : "border-l border-gray-300 dark:border-gray-700"
                      }`}
                  >
                    <Cpu className="w-3 h-3 text-gray-600 dark:text-gray-400" />

                    {/* Custom Provider Dropdown */}
                    <div className="relative" data-provider-menu="true">
                      <button
                        onClick={() => setIsProviderMenuOpen(!isProviderMenuOpen)}
                        className={`h-6 px-2 text-xs flex items-center gap-1 font-medium transition-colors ${uiStyle === "pixel"
                          ? "hover:bg-gray-300 dark:hover:bg-gray-700 border-2 border-gray-400 dark:border-gray-600 pixel-border font-bold"
                          : "rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                      >
                        <span
                          className={`${provider === "groq"
                            ? "text-pink-700 dark:text-pink-400"
                            : provider === "gemini"
                              ? "text-emerald-700 dark:text-emerald-400"
                              : provider === "openai"
                                ? "text-violet-700 dark:text-violet-400"
                                : "text-orange-700 dark:text-orange-400"
                            }`}
                        >
                          {uiStyle === "pixel" ? PROVIDERS[provider].name.toUpperCase() : PROVIDERS[provider].name}
                        </span>
                        <ChevronDown className="w-3 h-3" />
                      </button>

                      {isProviderMenuOpen && (
                        <div
                          className={`absolute right-0 bottom-full mb-1 w-40 py-1 z-50 ${uiStyle === "pixel"
                            ? "bg-gray-200 dark:bg-gray-800 border-4 border-gray-400 dark:border-gray-600 pixel-border"
                            : "bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700"
                            }`}
                        >
                          {Object.entries(PROVIDERS).map(([key, providerData]) => (
                            <button
                              key={key}
                              onClick={() => handleProviderChange(key as Provider)}
                              className={`flex items-center justify-between w-full px-3 py-1.5 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 ${uiStyle === "pixel" ? "pixel-font" : ""
                                }`}
                            >
                              <span className={`${key === provider ? "font-medium" : ""}`}>
                                {uiStyle === "pixel" ? providerData.name.toUpperCase() : providerData.name}
                              </span>
                              {key === provider ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                providerData.requiresApiKey &&
                                ((key === "openai" && !apiKeys.openai) || (key === "claude" && !apiKeys.claude)) && (
                                  <Key className="w-3 h-3 text-gray-400" />
                                )
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Activity Matrix */}
        <div
          className={`hidden xl:flex w-80 flex-col ${uiStyle === "pixel"
            ? "bg-gray-200 dark:bg-gray-800 border-l-4 border-gray-400 dark:border-gray-600"
            : "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-gray-200 dark:border-cyan-500/20"
            }`}
        >
          <div
            className={`p-6 ${uiStyle === "pixel" ? "max-h-[80vh]  pr-2" : ""
              }`}
          >
            <ActivityMatrix messages={messages} currentMode={mode} />
          </div>

        </div>
      </div>

      {/* API Key Dialog */}
      <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
        <DialogContent
          className={`w-[calc(100%-2rem)] max-w-md sm:w-full sm:mx-auto px-4 py-6 sm:px-6 sm:py-8 ${uiStyle === "pixel"
              ? "bg-gray-200 dark:bg-gray-800 border-4 border-gray-400 dark:border-gray-600 pixel-border rounded-none"
              : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"
            }`}
        >
          <DialogHeader>
            <DialogTitle
              className={`text-gray-900 dark:text-gray-100 ${uiStyle === "pixel" ? "pixel-font font-bold" : ""}`}
            >
              {uiStyle === "pixel"
                ? `${PROVIDERS[selectedProvider]?.name.toUpperCase()} API KEY REQUIRED`
                : `Enter ${PROVIDERS[selectedProvider]?.name} API Key`}
            </DialogTitle>
            <DialogDescription
              className={`text-gray-600 dark:text-gray-400 ${uiStyle === "pixel" ? "pixel-font" : ""}`}
            >
              To use {PROVIDERS[selectedProvider]?.name}, please enter your API key. It will be stored securely in your
              browser.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="api-key"
                className={`text-sm font-medium text-gray-900 dark:text-gray-100 ${uiStyle === "pixel" ? "font-bold pixel-font" : ""
                  }`}
              >
                {uiStyle === "pixel"
                  ? `${PROVIDERS[selectedProvider]?.name.toUpperCase()} API KEY`
                  : `${PROVIDERS[selectedProvider]?.name} API Key`}
              </label>
              <Input
                id="api-key"
                type="password"
                placeholder={`Enter your ${PROVIDERS[selectedProvider]?.name} API key`}
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                className={`text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${uiStyle === "pixel"
                  ? "bg-gray-100 dark:bg-gray-900 border-4 border-gray-400 dark:border-gray-600 pixel-font pixel-border"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  }`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleSaveApiKey()
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setIsApiKeyDialogOpen(false)}
              className={`text-gray-900 dark:text-gray-100 ${uiStyle === "pixel"
                ? "border-4 border-gray-400 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 pixel-font pixel-border"
                : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
            >
              {uiStyle === "pixel" ? "CANCEL" : "Cancel"}
            </Button>
            <Button
              onClick={handleSaveApiKey}
              disabled={!tempApiKey.trim()}
              className={`text-white ${uiStyle === "pixel"
                ? "bg-cyan-600 hover:bg-cyan-700 pixel-font font-bold border-4 border-cyan-400 pixel-border"
                : "bg-cyan-600 hover:bg-cyan-700"
                }`}
            >
              {uiStyle === "pixel" ? "SAVE & SWITCH" : "Save & Switch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        .pixel-font {
          font-family: 'Press Start 2P', 'Courier New', monospace;
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
        
        .pixel-border {
          border-style: solid;
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
        
        /* Remove all rounded corners for pixel perfect look */
        .pixel-font * {
          border-radius: 0 !important;
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-thumb-gray-400 {
          scrollbar-color: #9ca3af transparent;
        }
        .dark .scrollbar-thumb-gray-500 {
          scrollbar-color: #6b7280 transparent;
        }
        .scrollbar-track-transparent {
          scrollbar-track-color: transparent;
        }
        
        /* Webkit scrollbar styles */
        .scrollbar-thin::-webkit-scrollbar {
          width: 2px;
          height: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #9ca3af;
          border-radius: 1px;
        }
        .dark .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #6b7280;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: #6b7280;
        }
        .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }
        
        /* Pixel button effects */
        .pixel-font button:active {
          transform: translateY(2px);
        }
        
        /* Remove focus rings and add pixel borders */
        .pixel-font *:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        
        /* Pixel-perfect animations */
        @keyframes pixelBounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        
        .pixel-font .animate-bounce {
          animation: pixelBounce 1s infinite;
        }
      `}</style>
    </div>
  )
}
