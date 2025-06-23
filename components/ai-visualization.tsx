"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface AIVisualizationProps {
  mode: string
  isActive: boolean
}

export function AIVisualization({ mode, isActive }: AIVisualizationProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)
  const animationRef = useRef<number | null>(null)
  const particleDataRef = useRef<{
    originalPositions: Float32Array
    velocities: Float32Array
    phases: Float32Array
  } | null>(null)

  // Mode-based styling
  const modeStyles = {
    general: {
      color:
        "border-cyan-500/40 shadow-cyan-500/20 bg-gradient-to-br from-cyan-100/30 to-blue-100/30 dark:from-cyan-950/30 dark:to-blue-950/30",
      particleColor: new THREE.Color(0x00a0ff),
    },
    
  }

  const currentModeStyle = modeStyles[mode as keyof typeof modeStyles] || modeStyles.general

  useEffect(() => {
    if (!mountRef.current) return

    // Clean up previous scene
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(200, 200)
    renderer.setClearColor(0x000000, 0)

    // Clear previous canvas
    if (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild)
    }
    mountRef.current.appendChild(renderer.domElement)

    // Particle system with more particles
    const particleCount = 1200
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const originalPositions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    const phases = new Float32Array(particleCount)

    const baseColor = currentModeStyle.particleColor

    // Create particles within a sphere with better distribution
    for (let i = 0; i < particleCount; i++) {
      // Create multiple layers of particles for better density
      const layer = Math.floor(i / (particleCount / 4))
      const baseRadius = 0.3 + layer * 0.4
      const radiusVariation = Math.random() * 0.3
      const radius = baseRadius + radiusVariation

      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      // Set positions
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // Store original positions
      originalPositions[i * 3] = x
      originalPositions[i * 3 + 1] = y
      originalPositions[i * 3 + 2] = z

      // Set colors with variation
      const colorVariation = 0.6 + Math.random() * 0.8
      const brightness = 0.8 + Math.random() * 0.4
      colors[i * 3] = baseColor.r * colorVariation * brightness
      colors[i * 3 + 1] = baseColor.g * colorVariation * brightness
      colors[i * 3 + 2] = baseColor.b * colorVariation * brightness

      // Initialize velocities for continuous movement
      velocities[i * 3] = (Math.random() - 0.5) * 0.004
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.004
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.004

      // Random phase for wave motion
      phases[i] = Math.random() * Math.PI * 2
    }

    // Store particle data
    particleDataRef.current = {
      originalPositions,
      velocities,
      phases,
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    camera.position.z = 4

    sceneRef.current = scene
    rendererRef.current = renderer
    particlesRef.current = particles

    // Animation loop with continuous movement
    let time = 0
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      time += 0.008

      if (particles && particleDataRef.current) {
        const positionAttribute = particles.geometry.getAttribute("position") as THREE.BufferAttribute
        const positions = positionAttribute.array as Float32Array
        const { originalPositions, velocities, phases } = particleDataRef.current

        // Always animate particles (not just when active)
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3

          // Base wave motion (always active)
          const waveIntensity = isActive ? 0.08 : 0.04
          const waveSpeed = isActive ? 1.5 : 0.8

          const waveX = Math.sin(time * waveSpeed + phases[i]) * waveIntensity
          const waveY = Math.cos(time * waveSpeed * 1.2 + phases[i] * 1.3) * waveIntensity
          const waveZ = Math.sin(time * waveSpeed * 0.9 + phases[i] * 0.8) * waveIntensity

          // Add orbital motion
          const orbitSpeed = isActive ? 0.3 : 0.15
          const orbitRadius = 0.02
          const orbitX = Math.cos(time * orbitSpeed + phases[i] * 2) * orbitRadius
          const orbitY = Math.sin(time * orbitSpeed * 1.1 + phases[i] * 2.5) * orbitRadius

          // Combine motions
          positions[i3] = originalPositions[i3] + waveX + orbitX
          positions[i3 + 1] = originalPositions[i3 + 1] + waveY + orbitY
          positions[i3 + 2] = originalPositions[i3 + 2] + waveZ

          // Ensure particles stay within boundary
          const currentRadius = Math.sqrt(
            positions[i3] * positions[i3] +
              positions[i3 + 1] * positions[i3 + 1] +
              positions[i3 + 2] * positions[i3 + 2],
          )

          const maxRadius = 1.9
          if (currentRadius > maxRadius) {
            const scale = maxRadius / currentRadius
            positions[i3] *= scale
            positions[i3 + 1] *= scale
            positions[i3 + 2] *= scale
          }
        }

        positionAttribute.needsUpdate = true

        // Continuous rotation
        const rotationSpeed = isActive ? 0.01 : 0.005
        particles.rotation.y += rotationSpeed
        particles.rotation.x += rotationSpeed * 0.5

        // Pulsing effect
        const pulseIntensity = isActive ? 0.08 : 0.03
        const pulse = 1 + Math.sin(time * 2) * pulseIntensity
        particles.scale.setScalar(pulse)
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [mode, isActive]) // Re-run when mode or isActive changes

  return (
    <div className="flex justify-center">
      <div
        ref={mountRef}
        className={`w-48 h-48 rounded-full ${currentModeStyle.color} backdrop-blur-sm shadow-2xl overflow-hidden transition-all duration-500 ease-in-out`}
      />
    </div>
  )
}
