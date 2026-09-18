"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Camera, X, RefreshCw, Sparkles, AlertCircle, Upload, Check, Zap } from "lucide-react";

interface LiveCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string, fileName: string) => void;
  onFallbackUploadClick?: () => void;
}

export function LiveCameraModal({
  isOpen,
  onClose,
  onCapture,
  onFallbackUploadClick,
}: LiveCameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  // Stop camera tracks cleanly
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn("Error stopping camera track:", e);
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Check if device has multiple cameras
  const checkMultipleCameras = useCallback(async () => {
    try {
      if (navigator.mediaDevices?.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === "videoinput");
        setHasMultipleCameras(videoInputs.length > 1);
      }
    } catch (e) {
      console.warn("Could not enumerate camera devices:", e);
    }
  }, []);

  // Start camera stream
  const startCamera = useCallback(async (mode: "environment" | "user") => {
    setIsLoading(true);
    setErrorMessage(null);
    stopStream();

    if (!navigator?.mediaDevices?.getUserMedia) {
      setErrorMessage(
        "Camera API is not supported in this browser. Please use the file upload option instead."
      );
      setIsLoading(false);
      return;
    }

    try {
      // First attempt: with preferred facingMode and high resolution
      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });
      } catch (firstErr) {
        console.warn("Failed high-res camera request, falling back to basic video:", firstErr);
        // Fallback attempt: basic video constraint without facingMode or resolution locks
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Wait for video to be ready and playing
        await videoRef.current.play().catch((playErr) => {
          console.warn("Video play error (can occur if autoplay policy triggers):", playErr);
        });
      }

      setIsLoading(false);
      checkMultipleCameras();
    } catch (err: any) {
      console.error("Camera access error:", err);
      let msg = "Could not access camera.";
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        msg = "Camera permission was denied. Please allow camera permissions in your browser address bar.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        msg = "No camera was detected on this device. Please upload a photo instead.";
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        msg = "Camera is currently in use by another application.";
      } else if (err.name === "OverconstrainedError") {
        msg = "Requested camera settings could not be satisfied by your device.";
      }
      setErrorMessage(msg);
      setIsLoading(false);
    }
  }, [checkMultipleCameras, stopStream]);

  // Manage camera lifecycle based on isOpen and facingMode
  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      stopStream();
      setErrorMessage(null);
      setIsLoading(true);
    }

    return () => {
      stopStream();
    };
  }, [isOpen, facingMode, startCamera, stopStream]);

  // Toggle between front and back camera
  const handleToggleCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  // Capture frame from live video
  const handleCaptureFrame = () => {
    const video = videoRef.current;
    if (!video || !streamRef.current) return;

    setIsCapturing(true);
    setShowFlash(true);

    try {
      const canvas = document.createElement("canvas");
      // Use video natural resolution or sensible fallback
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get 2d rendering context for camera capture");

      // If user camera is mirrored, we flip horizontally for natural mirror feel
      if (facingMode === "user") {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(video, 0, 0, width, height);

      // Extract high quality JPEG data URL
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

      // Stop camera tracks immediately
      stopStream();

      // Brief flash effect timeout before returning
      setTimeout(() => {
        setShowFlash(false);
        setIsCapturing(false);
        onCapture(dataUrl, `camera-craft-${Date.now()}.jpg`);
        onClose();
      }, 350);
    } catch (e) {
      console.error("Failed to capture frame from video:", e);
      setIsCapturing(false);
      setShowFlash(false);
      setErrorMessage("Failed to capture snapshot from camera. Please try again.");
    }
  };

  // Mock test capture for testing or devices without physical camera
  const handleUseMockSample = (sampleType: "saree" | "pot" | "tray") => {
    let mockUrl = "https://images.unsplash.com/photo-1544816155-12df9643f363?w=1600&auto=format&fit=crop&q=85";
    let name = "Handcrafted Gond Bamboo Serving Tray";
    if (sampleType === "saree") {
      mockUrl = "/images/products/sample-saree.jpg";
      name = "Chanderi Silk Saree with Zari";
    } else if (sampleType === "pot") {
      mockUrl = "/images/products/sample-diya.jpg";
      name = "Terracotta Pierced Lantern";
    }

    stopStream();
    onCapture(mockUrl, `${sampleType}-camera-capture.jpg`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-craft-gold/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-neutral-900/90 border-b border-white/10 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-craft-terracotta/20 border border-craft-terracotta/40 flex items-center justify-center text-craft-terracotta">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white font-serif">
                  ShilpSutra Live Craft Camera
                </h3>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live View
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Hold your craft inside the frame • AI will auto-extract listing details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopStream();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close camera"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Viewfinder Viewport */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] bg-black overflow-hidden flex items-center justify-center">
          
          {/* Shutter White Flash Overlay */}
          {showFlash && (
            <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-300 pointer-events-none" />
          )}

          {/* Loading Indicator */}
          {isLoading && !errorMessage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-3 z-20 bg-neutral-950">
              <div className="relative flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-3 border-craft-gold/30 border-t-craft-gold animate-spin" />
                <Camera className="w-5 h-5 text-craft-gold absolute animate-pulse" />
              </div>
              <p className="text-xs text-craft-cream/80 font-medium">
                Initializing craft viewfinder...
              </p>
            </div>
          )}

          {/* Error / Permission Fallback View */}
          {errorMessage ? (
            <div className="p-6 text-center text-white max-w-md space-y-4 z-20">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-base text-craft-ivory">
                  Camera Access Notice
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {errorMessage}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => startCamera(facingMode)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Camera</span>
                </button>

                {onFallbackUploadClick && (
                  <button
                    type="button"
                    onClick={() => {
                      stopStream();
                      onClose();
                      onFallbackUploadClick();
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-craft-terracotta hover:bg-craft-terracotta-dark text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image File</span>
                  </button>
                )}
              </div>

              {/* Instant Test Sample Shortcuts */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <span className="text-[11px] text-neutral-400 block">
                  Or test live AI auto-fetch instantly using a sample craft:
                </span>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUseMockSample("saree")}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-craft-gold border border-craft-gold/30 cursor-pointer"
                  >
                    Chanderi Saree
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUseMockSample("pot")}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-300/30 cursor-pointer"
                  >
                    Terracotta Diya
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUseMockSample("tray")}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-emerald-300 border border-emerald-300/30 cursor-pointer"
                  >
                    Bamboo Tray
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* HTML5 Video Feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  facingMode === "user" ? "-scale-x-100" : ""
                }`}
              />

              {/* AI Vision Viewfinder Reticle & Guides */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6 sm:p-10">
                {/* 1:1 Target Frame */}
                <div className="relative aspect-square w-full max-w-sm rounded-2xl border-2 border-white/30 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] flex flex-col justify-between p-3">
                  
                  {/* Four Corner Brackets */}
                  <div className="flex justify-between">
                    <div className="w-5 h-5 border-t-3 border-l-3 border-craft-gold rounded-tl-md" />
                    <div className="w-5 h-5 border-t-3 border-r-3 border-craft-gold rounded-tr-md" />
                  </div>

                  {/* Center Scanning Crosshair */}
                  <div className="self-center flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border border-craft-gold/50 flex items-center justify-center animate-pulse">
                      <div className="w-1.5 h-1.5 rounded-full bg-craft-gold" />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="w-5 h-5 border-b-3 border-l-3 border-craft-gold rounded-bl-md" />
                    <div className="w-5 h-5 border-b-3 border-r-3 border-craft-gold rounded-br-md" />
                  </div>
                </div>

                {/* Floating Telemetry Badge */}
                <div className="absolute bottom-4 inset-x-0 flex justify-center">
                  <div className="bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-[11px] font-medium border border-white/20 flex items-center gap-2 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-craft-gold animate-spin" />
                    <span>Position craft inside frame • AI will auto-extract listing details</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Controls Bar */}
        <div className="p-4 sm:p-5 bg-neutral-900 border-t border-white/10 flex items-center justify-between gap-3">
          {/* Switch Camera Button (front/back) */}
          <div className="w-24 flex justify-start">
            <button
              type="button"
              disabled={isLoading || !!errorMessage}
              onClick={handleToggleCamera}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white transition-all disabled:opacity-30 cursor-pointer flex flex-col items-center gap-1 text-[10px]"
              title="Flip camera"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Flip Camera</span>
            </button>
          </div>

          {/* Main Shutter Button */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              disabled={isLoading || !!errorMessage || isCapturing}
              onClick={handleCaptureFrame}
              className="group relative flex items-center justify-center cursor-pointer disabled:opacity-40 transition-transform active:scale-95"
              aria-label="Capture craft photo"
            >
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-4 border-white/30 group-hover:border-white/50 flex items-center justify-center transition-colors">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-craft-terracotta group-hover:bg-craft-terracotta-dark text-white flex items-center justify-center shadow-lg transition-all">
                  <Camera className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </button>
            <span className="text-[11px] font-bold text-craft-gold tracking-wide">
              {isCapturing ? "Analyzing Craft..." : "Snap & Auto-Fetch"}
            </span>
          </div>

          {/* Switch to File Upload Shortcut */}
          <div className="w-24 flex justify-end">
            {onFallbackUploadClick ? (
              <button
                type="button"
                onClick={() => {
                  stopStream();
                  onClose();
                  onFallbackUploadClick();
                }}
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white transition-all cursor-pointer flex flex-col items-center gap-1 text-[10px]"
                title="Browse files"
              >
                <Upload className="w-4 h-4 text-craft-gold" />
                <span className="hidden sm:inline">Upload File</span>
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
