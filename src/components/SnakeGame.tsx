import React, { useEffect, useRef, useState, useCallback } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const moveSnake = useCallback(() => {
    if (isGameOver) return;

    const newSnake = [...snake];
    const head = { ...newSnake[0] };
    head.x += direction.x;
    head.y += direction.y;

    // Boundary check
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setIsGameOver(true);
      return;
    }

    // Self-collision check
    if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setIsGameOver(true);
      return;
    }

    newSnake.unshift(head);

    // Food check
    if (head.x === food.x && head.y === food.y) {
      setScore(s => s + 10);
      onScoreChange(score + 10);
      generateFood(newSnake);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, isGameOver, onScoreChange, score]);

  const generateFood = (currentSnake: { x: number, y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(s => s.x === newFood.x && s.y === newFood.y)) break;
    }
    setFood(newFood);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellWidth = canvas.width / GRID_SIZE;
    const cellHeight = canvas.height / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid (Subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellWidth, 0);
        ctx.lineTo(i * cellWidth, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellHeight);
        ctx.lineTo(canvas.width, i * cellHeight);
        ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#ff00ff'; // Neon Magenta
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
        food.x * cellWidth + cellWidth / 2,
        food.y * cellHeight + cellHeight / 2,
        cellWidth / 3,
        0,
        Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00f3ff' : 'rgba(0, 243, 255, 0.6)';
      ctx.shadowBlur = index === 0 ? 15 : 0;
      ctx.shadowColor = '#00f3ff';
      
      const x = segment.x * cellWidth + 2;
      const y = segment.y * cellHeight + 2;
      const w = cellWidth - 4;
      const h = cellHeight - 4;
      
      ctx.fillRect(x, y, w, h);
    });

    if (isGameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ff00ff';
      ctx.font = '20px "JetBrains Mono"';
      ctx.textAlign = 'center';
      ctx.fillText('CONNECTION LOST', canvas.width / 2, canvas.height / 2);
      ctx.font = '12px "JetBrains Mono"';
      ctx.fillText('PRESS SPACE TO REBOOT', canvas.width / 2, canvas.height / 2 + 30);
    }
  }, [snake, food, isGameOver]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setScore(0);
    onScoreChange(0);
  };

  useEffect(() => {
    const handleReset = (e: KeyboardEvent) => {
        if (e.code === 'Space' && isGameOver) {
            resetGame();
        }
    };
    window.addEventListener('keydown', handleReset);
    return () => window.removeEventListener('keydown', handleReset);
  }, [isGameOver]);

  return (
    <div className="relative group">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="border-2 border-border-dim bg-cyber-bg shadow-[0_0_50px_rgba(0,0,0,1)] transition-all duration-300"
      />
      <div className="absolute inset-0 border border-neon-cyan/10 pointer-events-none" />
      <div className="absolute top-2 right-2 font-mono text-[8px] text-neon-cyan opacity-30 uppercase tracking-widest">
        Node_Link: ACTIVE
      </div>
    </div>
  );
};
