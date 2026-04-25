import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';

export interface Track {
  id: number;
  title: string;
  artist: string;
  cover: string;
  duration: string;
  bpm: number;
  genre: string;
}

export const TRACKS: Track[] = [
  {
    id: 1,
    title: "NEURAL_DRIFT.mp3",
    artist: "CYBER_MIND",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&h=300&auto=format&fit=crop",
    duration: "03:42",
    bpm: 124,
    genre: "Synthwave AI"
  },
  {
    id: 2,
    title: "GHOST_IN_THE_SHELL.wav",
    artist: "PROTOCOL_X",
    cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300&h=300&auto=format&fit=crop",
    duration: "04:15",
    bpm: 110,
    genre: "Glitch AI"
  },
  {
    id: 3,
    title: "SYNTH_OVERLOAD.flac",
    artist: "VOID_WALKER",
    cover: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=300&h=300&auto=format&fit=crop",
    duration: "02:58",
    bpm: 140,
    genre: "Techno AI"
  }
];

interface MusicLibraryProps {
  currentTrackIndex: number;
  setCurrentTrackIndex: (index: number) => void;
  isPlaying: boolean;
}

export const MusicLibrary: React.FC<MusicLibraryProps> = ({ currentTrackIndex, setCurrentTrackIndex, isPlaying }) => {
  return (
    <div className="flex flex-col gap-4">
      {TRACKS.map((track, index) => (
        <div 
          key={track.id}
          onClick={() => setCurrentTrackIndex(index)}
          className={`group cursor-pointer p-3 rounded-lg border transition-all duration-300 ${
            index === currentTrackIndex 
              ? 'border-neon-cyan bg-neon-cyan/5 shadow-[0_0_15px_rgba(0,242,255,0.1)]' 
              : 'border-border-dim bg-[#0d0d0d] hover:border-white/20'
          }`}
        >
          <div className="flex justify-between items-start mb-1">
            <span className={`text-sm font-medium ${index === currentTrackIndex ? 'text-neon-cyan' : 'text-white'}`}>
              {track.title}
            </span>
            <span className={`text-[10px] font-mono ${index === currentTrackIndex ? 'text-neon-cyan' : 'text-text-dim'}`}>
              {track.duration}
            </span>
          </div>
          <p className={`text-[11px] ${index === currentTrackIndex ? 'text-neon-cyan/60' : 'text-text-dim'}`}>
            {track.genre} • {track.bpm} BPM
          </p>

          {index === currentTrackIndex && isPlaying && (
            <div className="mt-3 flex gap-1 items-end h-4">
              {[0.4, 1, 0.75, 0.25, 0.75].map((h, i) => (
                <motion.div 
                  key={i}
                  className="w-1 bg-neon-cyan"
                  animate={{ height: [`${h * 25}%`, `${h * 100}%`, `${h * 50}%`] }}
                  transition={{ duration: 0.5 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

interface MusicControlsProps {
  currentTrackIndex: number;
  setCurrentTrackIndex: (index: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export const MusicControls: React.FC<MusicControlsProps> = ({ 
  currentTrackIndex, 
  setCurrentTrackIndex, 
  isPlaying, 
  setIsPlaying 
}) => {
  const track = TRACKS[currentTrackIndex];
  
  const nextTrack = () => setCurrentTrackIndex((currentTrackIndex + 1) % TRACKS.length);
  const prevTrack = () => setCurrentTrackIndex((currentTrackIndex - 1 + TRACKS.length) % TRACKS.length);

  return (
    <footer className="h-24 bg-surface border-t border-border-dim px-8 flex items-center shrink-0 relative overflow-hidden">
      <div className="w-64">
        <div className="text-xs font-semibold text-white truncate">{track.title}</div>
        <div className="text-[10px] text-text-dim mt-1">{track.artist}</div>
      </div>

      <div className="flex-1 flex flex-col items-center gap-3 px-12">
        <div className="flex items-center gap-8">
          <button 
            onClick={prevTrack}
            className="text-text-dim hover:text-white transition-colors"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full border-2 border-neon-cyan flex items-center justify-center text-neon-cyan shadow-[0_0_15px_rgba(0,242,255,0.2)] hover:bg-neon-cyan hover:text-black transition-all"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}
          </button>

          <button 
            onClick={nextTrack}
            className="text-text-dim hover:text-white transition-colors"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>

        <div className="w-full flex items-center gap-4">
          <span className="text-[10px] font-mono text-text-dim">1:12</span>
          <div className="flex-1 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-neon-cyan" 
              initial={{ width: "45%" }}
              animate={{ width: isPlaying ? "100%" : "45%" }}
              transition={{ duration: 180, ease: "linear" }}
            />
          </div>
          <span className="text-[10px] font-mono text-text-dim">{track.duration}</span>
        </div>
      </div>

      <div className="w-64 flex justify-end gap-6 items-center">
        <div className="flex items-center gap-2">
          <Volume2 size={16} className="text-text-dim" />
          <div className="w-24 h-1 bg-[#1a1a1a] rounded-full relative">
            <div className="absolute top-0 left-0 h-full w-[70%] bg-text-dim" />
          </div>
        </div>
      </div>
    </footer>
  );
};
