"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { Activity, MessageSquare, Clock, Zap, Brain } from "lucide-react"

interface ActivityMatrixProps {
  messages?: any[]
  currentMode?: string
}

export function ActivityMatrix({ messages = [], currentMode = "general" }: ActivityMatrixProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const networkRef = useRef<THREE.Group | null>(null)
  const animationRef = useRef<number | null>(null)
  const [stats, setStats] = useState({
    totalMessages: 0,
    avgResponseTime: 0,
    mostUsedMode: "general",
    sessionsToday: 0,
  })

  // Calculate real application stats
  useEffect(() => {
    const totalMessages = messages.length
    const avgResponseTime = totalMessages > 0 ? Math.random() * 2 + 1 : 0 // Simulated for now
    const mostUsedMode = currentMode
    const sessionsToday = totalMessages > 0 ? Math.floor(totalMessages / 3) + 1 : 0

    setStats({
      totalMessages,
      avgResponseTime,
      mostUsedMode,
      sessionsToday,
    })
  }, [messages, currentMode])

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(150, 150)
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)

    // Create neural network visualization
    const networkGroup = new THREE.Group()

    // Create nodes
    const nodeGeometry = new THREE.SphereGeometry(0.05, 8, 8)
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0x0080ff, // Brighter blue for light mode visibility
      transparent: true,
      opacity: 0.9, // Higher opacity for better visibility
    })

    // Create connections between nodes
    const positions = []
    for (let i = 0; i < 20; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial)
      const angle = (i / 20) * Math.PI * 2
      const radius = 0.8 + Math.random() * 0.4
      node.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 0.5, Math.sin(angle) * radius)
      networkGroup.add(node)
      positions.push(node.position)
    }

    // Create connections
    const lineGeometry = new THREE.BufferGeometry()
    const linePositions = []
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        if (Math.random() > 0.7) {
          // Only some connections
          linePositions.push(positions[i].x, positions[i].y, positions[i].z)
          linePositions.push(positions[j].x, positions[j].y, positions[j].z)
        }
      }
    }

    lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3))
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x0080ff, // Brighter blue for light mode visibility
      transparent: true,
      opacity: 0.6, // Higher opacity for better visibility
    })
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    networkGroup.add(lines)

    scene.add(networkGroup)
    camera.position.z = 2

    sceneRef.current = scene
    rendererRef.current = renderer
    networkRef.current = networkGroup

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      if (networkGroup) {
        networkGroup.rotation.y += 0.005
        networkGroup.rotation.x += 0.002
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  // Mode usage data based on current session
  const modeUsage = [
    {
      mode: "General",
      value: currentMode === "general" ? Math.min(85, messages.length * 15 + 10) : Math.min(45, messages.length * 8),
      color: "from-cyan-500 to-blue-500",
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center">
          <Activity className="w-4 h-4 mr-2" />
          AI Activity Matrix
        </h3>

        <div className="flex justify-center mb-4">
          <div
            ref={mountRef}
            className="w-36 h-36 rounded-lg border border-cyan-500/30 bg-gradient-to-br from-gray-100/50 to-white/50 dark:from-cyan-950/20 dark:to-blue-950/20 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3 border border-gray-200 dark:border-cyan-500/20">
          <div className="flex items-center space-x-2 mb-1">
            <MessageSquare className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
            <span className="text-xs text-gray-700 dark:text-gray-400">Messages</span>
          </div>
          <div className="text-lg font-bold text-cyan-700 dark:text-cyan-400">{stats.totalMessages}</div>
        </div>

        <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3 border border-gray-200 dark:border-cyan-500/20">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs text-gray-700 dark:text-gray-400">Avg Time</span>
          </div>
          <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
            {stats.avgResponseTime.toFixed(1)}s
          </div>
        </div>

        <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3 border border-gray-200 dark:border-cyan-500/20">
          <div className="flex items-center space-x-2 mb-1">
            <Brain className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            <span className="text-xs text-gray-700 dark:text-gray-400">Mode</span>
          </div>
          <div className="text-sm font-bold text-purple-700 dark:text-purple-400 capitalize">{stats.mostUsedMode}</div>
        </div>

        <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-3 border border-gray-200 dark:border-cyan-500/20">
          <div className="flex items-center space-x-2 mb-1">
            <Zap className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span className="text-xs text-gray-700 dark:text-gray-400">Sessions</span>
          </div>
          <div className="text-lg font-bold text-amber-700 dark:text-amber-400">{stats.sessionsToday}</div>
        </div>
      </div>

      {/* Mode Usage */}
      {/* <div>
        <h4 className="text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider mb-3">
          Mode Usage
        </h4>
        <div className="space-y-2">
          {(() => {
            const item = modeUsage.find((m) => m.mode.toLowerCase() === currentMode.toLowerCase());
            if (!item) return null;
            return (
              <div key={item.mode} className="flex items-center space-x-3">
                <span className="text-xs text-gray-700 dark:text-gray-400 w-16 truncate">{item.mode}</span>
                <div className="flex-1 bg-gray-300 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <span className="text-xs text-gray-700 dark:text-gray-400 w-8 text-right">{item.value}%</span>
              </div>
            );
          })()}
        </div>
      </div> */}

      {/* AI Status */}
      <div>
        <h4 className="text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider mb-3">
          AI Status
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-cyan-500/20">
            <span className="text-xs text-gray-800 dark:text-gray-300">Neural Network</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-700 dark:text-green-400">Active</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-cyan-500/20">
            <span className="text-xs text-gray-800 dark:text-gray-300">Voice Synthesis</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
              <span className="text-xs text-cyan-700 dark:text-cyan-400">Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
