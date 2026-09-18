"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  RotateCcw, 
  AlertCircle, 
  Sparkles, 
  Languages, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface VoiceRecorderProps {
  onTranscriptionComplete: (transcript: string, detectedLanguage: string) => void;
  initialTranscript?: string;
}

const SUPPORTED_LANGUAGES = [
  { code: "hi-IN", label: "हिन्दी (Hindi)" },
  { code: "en-IN", label: "English (India)" },
  { code: "mr-IN", label: "मराठी (Marathi)" },
  { code: "gu-IN", label: "ગુજરાતી (Gujarati)" },
  { code: "bn-IN", label: "বাংলা (Bengali)" },
  { code: "ta-IN", label: "தமிழ் (Tamil)" },
  { code: "te-IN", label: "తెలుగు (Telugu)" }
];

const SAMPLE_VOICE_SCRIPTS = [
  {
    lang: "en-IN",
    label: "Handwoven Saree (English)",
    text: "This is a handwoven cotton saree. It is dark red with traditional golden patterns from Madhya Pradesh. The price is 1800 rupees."
  },
  {
    lang: "hi-IN",
    label: "मिट्टी का दीपक (हिन्दी)",
    text: "यह हाथ से बना मिट्टी का जालीदार दीया है। राजस्थान की बनास नदी की मिट्टी से बना है। पारंपरिक नक्काशी है। इसकी कीमत 650 रुपये है।"
  },
  {
    lang: "hi-IN",
    label: "बांस की टोकरी (हिन्दी)",
    text: "यह प्राकृतिक बांस से बुनी हुई फल की टोकरी है। मध्य प्रदेश के जंगलों का बांस है। बहुत मजबूत है और कीमत 500 रुपये है।"
  }
];

export function VoiceRecorder({ onTranscriptionComplete, initialTranscript = "" }: VoiceRecorderProps) {
  const { language } = useLanguage();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(language === "hi" ? "hi-IN" : "en-IN");
  const [transcript, setTranscript] = useState<string>(initialTranscript);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const recognitionRef = useRef<any>(null);

  // Sync language with global language
  useEffect(() => {
    setSelectedLanguage(language === "hi" ? "hi-IN" : "en-IN");
  }, [language]);

  // Audio level visualizer interval when recording
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setAudioLevel(Math.floor(Math.random() * 80) + 20);
      }, 120);
    } else {
      setAudioLevel(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = () => {
    setErrorMessage(null);
    setTranscript("");

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage(
        "Speech recognition is not supported in this browser. You can click any sample speech below or type your description directly."
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = selectedLanguage;
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.maxAlternatives = 1;

      let finalResult = "";

      recognition.onstart = () => {
        setIsRecording(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalResult += event.results[i][0].transcript + " ";
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        const currentText = (finalResult + interim).trim();
        setTranscript(currentText);
      };

      recognition.onerror = (event: any) => {
        setIsRecording(false);
        if (event.error === "not-allowed" || event.error === "permission-denied") {
          setErrorMessage(
            "Microphone permission denied. Please allow microphone access in your browser settings to speak, or select a sample voice prompt below."
          );
        } else if (event.error === "no-speech") {
          setErrorMessage("No speech was detected. Please tap the microphone and speak again.");
        } else {
          setErrorMessage(`Speech recognition error (${event.error}). You can try again or use sample voice.`);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (err: any) {
      setIsRecording(false);
      setErrorMessage("Could not start microphone. Please check browser permissions or use sample speech.");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // safe ignore
      }
    }
    setIsRecording(false);
  };

  const handleUseSample = (sample: typeof SAMPLE_VOICE_SCRIPTS[0]) => {
    setSelectedLanguage(sample.lang);
    setTranscript(sample.text);
    setErrorMessage(null);
  };

  const handleProceed = () => {
    if (transcript.trim()) {
      onTranscriptionComplete(transcript.trim(), selectedLanguage);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-8">
      
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-craft-terracotta">
            <Mic className="w-3.5 h-3.5" />
            <span>Step 1 of 5: Speak Your Product</span>
          </div>
          <h2 className="font-serif font-bold text-2xl text-neutral-900">
            Voice Recording & Speech-to-Text
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Speak naturally about your craft, its material, color, design, origin, and price. ShilpSutra converts your voice into structured product details.
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-2xl p-1.5 self-start sm:self-auto">
          <Languages className="w-4 h-4 text-craft-green ml-2" />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            disabled={isRecording}
            className="bg-transparent text-xs font-bold text-neutral-800 focus:outline-none cursor-pointer pr-2"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Microphone Action Card */}
      <div className="flex flex-col items-center justify-center py-8 px-4 bg-gradient-to-b from-craft-cream/40 to-amber-50/20 rounded-3xl border border-neutral-200 text-center space-y-6">
        
        {/* Animated Microphone Button */}
        <div className="relative">
          {/* Pulsing waves when recording */}
          {isRecording && (
            <>
              <div 
                className="absolute inset-0 rounded-full bg-craft-terracotta/20 animate-ping"
                style={{ animationDuration: "1.5s" }}
              />
              <div 
                className="absolute -inset-4 rounded-full bg-craft-terracotta/10 animate-pulse"
                style={{ transform: `scale(${1 + audioLevel / 100})` }}
              />
            </>
          )}

          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center shadow-xl transition-all cursor-pointer transform hover:scale-105 active:scale-95 ${
              isRecording
                ? "bg-craft-terracotta text-white ring-8 ring-craft-terracotta/30 animate-pulse"
                : "bg-craft-green hover:bg-craft-green-dark text-white ring-8 ring-craft-green/10"
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-10 h-10 mb-1" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Stop</span>
              </>
            ) : (
              <>
                <Mic className="w-10 h-10 mb-1 text-craft-gold" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Speak</span>
              </>
            )}
          </button>
        </div>

        {/* Recording Status & Audio Visualizer */}
        <div className="space-y-2 max-w-md">
          <div className="text-sm sm:text-base font-bold text-neutral-800 flex items-center justify-center gap-2">
            {isRecording ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-craft-terracotta animate-ping" />
                <span className="text-craft-terracotta">Recording in {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.label}... बोलिए...</span>
              </>
            ) : (
              <span>Tap the large mic button to start recording</span>
            )}
          </div>
          <p className="text-xs text-neutral-500">
            Tell us about your craft, colors, materials, where it was made, and your price.
          </p>

          {/* Audio Equalizer Bars */}
          {isRecording && (
            <div className="flex items-center justify-center gap-1.5 pt-2">
              {[40, 75, 100, 60, 30, 90, 80, 50, 70, 95, 45, 60].map((h, i) => (
                <span
                  key={i}
                  className="w-1.5 bg-craft-terracotta rounded-full transition-all duration-100"
                  style={{ height: `${Math.max(8, (h * audioLevel) / 100)}px` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="w-full max-w-lg bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-2xl text-xs flex items-start gap-2.5 text-left">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <span className="font-bold">Microphone Note:</span>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

      </div>

      {/* 1-Click Sample Voice Prompts (Useful for desktop testing or without mic) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-craft-gold" />
            <span>Try Sample Voice Recording (1-Click Test):</span>
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {SAMPLE_VOICE_SCRIPTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleUseSample(sample)}
              className="p-3 text-left bg-neutral-50 hover:bg-amber-50/70 border border-neutral-200 hover:border-craft-gold rounded-2xl transition-all cursor-pointer space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-craft-green group-hover:text-craft-terracotta">
                  {sample.label}
                </span>
                <Volume2 className="w-3.5 h-3.5 text-neutral-400 group-hover:text-craft-gold" />
              </div>
              <p className="text-[11px] text-neutral-600 line-clamp-2 italic">
                &ldquo;{sample.text}&rdquo;
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Editable Transcription Box */}
      {transcript && (
        <div className="space-y-2 bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Transcribed Speech (Editable)</span>
            </span>
            <button
              type="button"
              onClick={() => setTranscript("")}
              className="text-xs text-neutral-500 hover:text-neutral-700 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={3}
            placeholder="Your spoken words appear here. You can edit any mistake manually before extracting details."
            className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-craft-green font-medium leading-relaxed"
          />
          <p className="text-[11px] text-neutral-500">
            * You can directly edit the text above if any word was misheard. No need to re-record unless you want to.
          </p>

          <div className="flex justify-end pt-3">
            <button
              type="button"
              onClick={handleProceed}
              className="bg-craft-green hover:bg-craft-green-dark text-white font-bold px-7 py-3 rounded-xl text-sm flex items-center gap-2 shadow transition-all cursor-pointer"
            >
              <span>Extract Product Details</span>
              <ArrowRight className="w-4 h-4 text-craft-gold" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
