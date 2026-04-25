import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicLibrary, MusicControls } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="h-screen bg-cyber-bg text-[#e0e0e0] font-sans flex flex-col overflow-hidden border-4 border-[#121212] selection:bg-neon-magenta selection:text-white">
      {/* Header */}
      <header className="h-16 border-b border-border-dim bg-surface flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-neon-cyan shadow-[0_0_15px_rgba(0,242,255,0.4)] flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-sm rotate-45"></div>
          </div>
          <h1 className="text-xl font-bold tracking-tighter text-neon-cyan uppercase font-display italic">
            NEON REWIND <span className="text-[10px] font-mono opacity-50 ml-2 normal-case tracking-normal">V.2.0.4</span>
          </h1>
        </div>
        
        <div className="flex gap-12 items-center">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-text-dim">Current Score</span>
            <span className="text-2xl font-mono text-neon-cyan leading-none">{score.toString().padStart(6, '0')}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-text-dim">High Score</span>
            <span className="text-2xl font-mono text-neon-magenta leading-none">{highScore.toString().padStart(6, '0')}</span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Aside: Library */}
        <aside className="w-72 border-r border-border-dim bg-[#080808] flex flex-col p-6 shrink-0 z-10">
          <h2 className="text-xs uppercase tracking-[0.2em] text-text-dim mb-6 font-semibold">AI Audio Library</h2>
          <MusicLibrary 
            currentTrackIndex={currentTrackIndex} 
            setCurrentTrackIndex={setCurrentTrackIndex} 
            isPlaying={isPlaying}
          />
          <div className="mt-auto pt-6 border-t border-border-dim">
            <div className="text-[10px] text-[#444] leading-relaxed uppercase tracking-wider font-mono">
              System Status: Active<br />
              Audio Buffer: Optimized<br />
              Render Latency: 4ms
            </div>
          </div>
        </aside>

        {/* Center: Snake Game */}
        <section className="flex-1 bg-black relative flex items-center justify-center p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1a1a1a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10"
          >
            <SnakeGame onScoreChange={handleScoreChange} />
          </motion.div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <span className="text-[10px] text-text-dim tracking-[0.3em] uppercase font-mono">Use Arrow Keys to Navigate</span>
          </div>
        </section>

        {/* Right Aside: Stats */}
        <aside className="w-72 border-l border-border-dim bg-[#080808] p-6 shrink-0 z-10">
          <h2 className="text-xs uppercase tracking-[0.2em] text-text-dim mb-6 font-semibold">Session Stats</h2>
          <div className="space-y-6">
             <div className="flex justify-between items-end border-b border-border-dim pb-2">
                <span className="text-[11px] text-text-dim uppercase tracking-wider">Length</span>
                <span className="text-sm font-mono">{score / 10 + 1} Nodes</span>
             </div>
             <div className="flex justify-between items-end border-b border-border-dim pb-2">
                <span className="text-[11px] text-text-dim uppercase tracking-wider">Velocity</span>
                <span className="text-sm font-mono">1.{Math.floor(score/50)}x</span>
             </div>
             <div className="flex justify-between items-end border-b border-border-dim pb-2">
                <span className="text-[11px] text-text-dim uppercase tracking-wider">Multiplier</span>
                <span className="text-sm font-mono text-neon-magenta tracking-tighter">x{(1 + score / 500).toFixed(1)}</span>
             </div>

             <div className="pt-4">
                <span className="text-[10px] uppercase text-text-dim block mb-3 tracking-widest font-semibold">Volume Matrix</span>
                <div className="flex items-end gap-1 h-16">
                  {[0.2, 0.4, 0.75, 0.6, 0.3, 0.5, 0.1].map((h, i) => (
                    <motion.div 
                      key={i}
                      className={`flex-1 ${i === 2 || i === 3 ? 'bg-neon-cyan' : 'bg-[#1a1a1a]'}`}
                      style={{ height: `${h * 100}%` }}
                      animate={isPlaying ? { height: [`${h * 80}%`, `${h * 120}%`, `${h * 100}%`] } : {}}
                      transition={{ duration: 0.8 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ))}
                </div>
             </div>
          </div>
        </aside>
      </main>

      {/* Footer: Controls */}
      <MusicControls 
        currentTrackIndex={currentTrackIndex} 
        setCurrentTrackIndex={setCurrentTrackIndex}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />
      
      {/* HUD Scanlines */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] crt-lines" />
    </div>
  );
}
