'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const getTimeRoast = (hour) => {
  if (hour >= 0 && hour < 5) return "💀 It’s real n*** hours 🤙😏😏 go to sleep bro";
  if (hour >= 5 && hour < 7) return "🌅 Sun’s not even up yet… why are you here?";
  if (hour >= 22) return "🌙 You’re entering the danger zone…";
  return "✅ All good. For now...";
};

export default function SanityChecker() {
  const [roast, setRoast] = useState('');
  const [degenerationLevel, setDegenerationLevel] = useState(0);

  useEffect(() => {
    const hour = new Date().getHours();
    setRoast(getTimeRoast(hour));

    const interval = setInterval(() => {
      setDegenerationLevel((lvl) => Math.min(lvl + 1, degenerationMessages.length - 1));
    }, 10000); // Increase level every 10s

    return () => clearInterval(interval);
  }, []);

  const degenerationMessages = [
    "", // Level 0: no message yet
    "you’re still here huh…",
    "bro for real, close the tab.",
    "okay… starting to worry now",
    "touch some grass. please.",
    "internet detox imminent. browser self-destruct in 3... 2..."
  ];

  const degenerationImages = [
    "", // Placeholder for level 0
    "/manu.jpeg",
    "/bbh.jpg",
    "/sip.jpeg",
    "/abs.png",
    "/tng.jpeg"
  ];

  const showRoast = degenerationLevel === 0; // Only show initial roast if no degeneration yet
  const currentMessage = degenerationMessages[degenerationLevel];
  const currentImage = degenerationImages[degenerationLevel];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center p-6">
      {showRoast && (
        <p className="text-xl md:text-2xl font-semibold text-pink-400 mb-6">{roast}</p>
      )}

      {degenerationLevel > 0 && (
        <div className="flex flex-col items-center">
          {currentImage && (
            <Image
              src={currentImage}
              alt="degeneration"
              width={200}
              height={200}
              className="mb-6"
            />
          )}
          <p className="text-lg md:text-xl text-red-400 italic animate-pulse">
            {currentMessage}
          </p>
        </div>
      )}
    </main>
  );
}
