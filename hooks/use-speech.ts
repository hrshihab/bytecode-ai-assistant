"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useSpeech() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const onTranscriptRef = useRef<((transcript: string) => void) | null>(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Speech Recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (onTranscriptRef.current) {
          onTranscriptRef.current(transcript);
        }
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionInstance.onend = () => setIsListening(false);

      recognitionRef.current = recognitionInstance;
    } else {
      setError("Speech recognition is not supported in your browser.");
    }

    // Speech Synthesis
    if ("speechSynthesis" in window) {
      synthesisRef.current = window.speechSynthesis;

      // Force voice preload
      window.speechSynthesis.getVoices();
    } else {
      setError("Speech synthesis is not supported in your browser.");
    }
  }, []);

  const speakMessage = useCallback((text: string) => {
    const synthesis = synthesisRef.current;
    if (!synthesis) {
      setError("Speech synthesis is not available.");
      return;
    }

    // Cancel ongoing speech
    synthesis.cancel();

    // Clean text
    const cleanedText = text.replace(
      /[\p{Emoji_Presentation}\p{Emoji}\u200D]+/gu,
      ""
    ).trim();

    if (!cleanedText) {
      // console.warn("Skipping empty or emoji-only speech input.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.rate = 1.2;
    utterance.pitch = 1.2;
    utterance.volume = 0.8;

    const selectVoice = () => {
      const voices = synthesis.getVoices();

      // Detect language
      const isHindiScript = /[\u0900-\u097F]/.test(cleanedText);
      const isHinglish = /\b(mera|tum|kya|hai|nahi|kaise|acha|haan|kyun|main|sab|pyaar|dil|kaisi|batao|suno|aise|vaise|ni|nhi|achaa|baat|mujhe|tumhe|kon|kahan)\b/i.test(cleanedText);
      const isHindi = isHindiScript || isHinglish;
      const isSpanish = /[ñáéíóúü]/i.test(cleanedText);
      const isFrench = /[àâäéèêëïîôöùûüÿç]/i.test(cleanedText);

      let selectedVoice: SpeechSynthesisVoice | null = null;

      if (isHindi) {
        selectedVoice = voices.find(v => v.lang === "hi-IN")
          ?? voices.find(v => v.lang === "en-IN")
          ?? null;
      } else if (isSpanish) {
        selectedVoice = voices.find(v => v.lang.startsWith("es")) ?? null;
      } else if (isFrench) {
        selectedVoice = voices.find(v => v.lang.startsWith("fr")) ?? null;
      }

      // Fallbacks: Indian or female English
      if (!selectedVoice) {
        selectedVoice =
          voices.find((v) => v.lang === "en-IN") ??
          voices.find((v) =>
            ["swara", "maya", "kajal", "padma", "zira", "karen", "samantha", "female", "woman", "española"].some((name) =>
              v.name.toLowerCase().includes(name)
            )
          ) ??
          voices.find((v) => v.lang.startsWith("en")) ??
          null;
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsSpeaking(false);
      };

      synthesis.speak(utterance);
    };

    // Handle delay if voices aren't available yet
    if (synthesis.getVoices().length === 0) {
      const handleVoicesChanged = () => {
        selectVoice();
        synthesis.removeEventListener("voiceschanged", handleVoicesChanged);
      };
      synthesis.addEventListener("voiceschanged", handleVoicesChanged);
    } else {
      selectVoice();
    }
  }, [isSpeaking]);

  const stopSpeaking = useCallback(() => {
    const synthesis = synthesisRef.current;
    if (synthesis) {
      synthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const startListening = useCallback(
    (onTranscript: (transcript: string) => void) => {
      const recognition = recognitionRef.current;
      if (!recognition) {
        setError("Speech recognition is not supported in your browser.");
        return;
      }

      if (isListening) {
        recognition.stop();
        return;
      }

      onTranscriptRef.current = onTranscript;
      recognition.start();
      setIsListening(true);
      setError(null);
    },
    [isListening]
  );

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (recognition && isListening) {
      recognition.stop();
    }
  }, [isListening]);

  return {
    isListening,
    isSpeaking,
    voiceEnabled,
    error,
    setVoiceEnabled,
    speakMessage,
    stopSpeaking,
    startListening,
    stopListening,
    clearError: () => setError(null),
  };
}
