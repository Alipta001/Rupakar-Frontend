'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, VolumeX } from 'lucide-react'

export default function LandingMusicControl() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Single shared audio instance for the landing page lifecycle
    const audio = new Audio('/music_mania-traditional-indian-music-for-film-and-documentary-250312.mp3')
    audio.loop = true
    audio.volume = 0.5
    audio.preload = 'auto'
    audioRef.current = audio

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    // Attempt immediate autoplay on initial mount.
    // Modern browsers (like Chrome/Safari) reject unmuted autoplay prior to user interaction;
    // this rejection is caught silently with zero console errors.
    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true)
        })
        .catch(() => {
          setIsPlaying(false)
        })
    }

    // Unmount cleanup: pause audio, clear source, and detach all listeners
    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)

      audio.pause()
      audio.currentTime = 0
      audio.src = ''
      audioRef.current = null
    }
  }, [])

  const togglePlayback = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.volume = 0.5
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
          })
          .catch(() => {
            setIsPlaying(false)
          })
      }
    }
  }

  return (
    <aside
      aria-label="Background music control"
      className="fixed right-3.5 sm:right-6 z-40 select-none"
      style={{
        // Safe-area aware positioning for mobile phones with home gesture indicators
        bottom: 'max(1rem, calc(0.75rem + env(safe-area-inset-bottom, 0px)))',
      }}
    >
      {/* ========================================================================= */}
      {/* 1. BIG SCREEN / DESKTOP VIEW (Always shows the full Play/Pause button)     */}
      {/* ========================================================================= */}
      <div className="hidden sm:flex items-center">
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
          title={isPlaying ? 'Pause background music' : 'Play background music'}
          className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full min-h-[40px] bg-[#2D1B12]/90 hover:bg-[#3A2418] text-[#F8F4EE] border border-[#C89B3C]/50 hover:border-[#C89B3C] shadow-lg shadow-black/30 backdrop-blur-md transition-all duration-200 active:scale-95 text-xs font-medium tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89B3C] cursor-pointer whitespace-nowrap"
        >
          {isPlaying ? (
            <span className="flex items-end gap-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true">
              <span className="w-0.5 bg-[#C89B3C] rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-3.5" />
              <span className="w-0.5 bg-[#C89B3C] rounded-full animate-[pulse_1.1s_ease-in-out_infinite_0.15s] h-2" />
              <span className="w-0.5 bg-[#C89B3C] rounded-full animate-[pulse_0.85s_ease-in-out_infinite_0.3s] h-3" />
            </span>
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-[#F8F4EE]/70 shrink-0" aria-hidden="true" />
          )}

          <span className="text-xs font-medium tracking-wider text-[#F8F4EE] select-none">
            {isPlaying ? 'Pause Music' : 'Play Music'}
          </span>

          <span
            className="flex items-center justify-center w-6 h-6 rounded-full bg-[#C89B3C]/20 text-[#C89B3C] group-hover:bg-[#C89B3C] group-hover:text-[#1E1A17] transition-colors shrink-0"
            aria-hidden="true"
          >
            {isPlaying ? (
              <Pause className="w-3 h-3 fill-current" />
            ) : (
              <Play className="w-3 h-3 fill-current translate-x-0.5" />
            )}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. PHONE SCREEN ONLY (Direct Play / Pause button - no dropdown or arrows) */}
      {/* ========================================================================= */}
      <div className="flex sm:hidden items-center">
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
          title={isPlaying ? 'Pause background music' : 'Play background music'}
          className="flex items-center justify-center w-11 h-11 rounded-full min-h-[44px] min-w-[44px] bg-[#2D1B12]/95 text-[#F8F4EE] border border-[#C89B3C]/50 shadow-lg shadow-black/30 backdrop-blur-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89B3C] touch-manipulation cursor-pointer"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-[#C89B3C] text-[#C89B3C]" />
          ) : (
            <Play className="w-5 h-5 fill-[#C89B3C] text-[#C89B3C] translate-x-0.5" />
          )}
        </button>
      </div>
    </aside>
  )
}
