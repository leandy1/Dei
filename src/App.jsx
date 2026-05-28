import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import BirthdayScene3D from './BirthdayScene3D';

/* ═══════════════════════════════════════════════════════════
   CONTEXTUAL SCENE ANIMATIONS — one per story beat
═══════════════════════════════════════════════════════════ */

/* 1. Cartoon Paths slowly converging */
const ScenePaths = () => (
  <svg width="150" height="100" viewBox="0 0 150 100" fill="none">
    {/* Ground / Background */}
    <ellipse cx="75" cy="85" rx="55" ry="15" fill="#e2dcc8" style={{ mixBlendMode: 'multiply' }} opacity="0.3" />

    <motion.path d="M20 10 C 60 10, 75 60, 75 70" stroke="#a78bfa" strokeWidth="8" strokeLinecap="round" strokeDasharray="15 15"
      initial={{ strokeDashoffset: 100 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />

    <motion.path d="M130 10 C 90 10, 75 60, 75 70" stroke="#f472b6" strokeWidth="8" strokeLinecap="round" strokeDasharray="15 15"
      initial={{ strokeDashoffset: 100 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 0.5 }} />

    {/* Meeting Point Star */}
    <motion.g animate={{ scale: [0, 1.2, 0.8, 1], rotate: [0, 180] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }} style={{ transformOrigin: '75px 75px' }}>
      <path d="M75 60 L78 70 L88 73 L78 76 L75 86 L72 76 L62 73 L72 70 Z" fill="#fbbf24" />
      <circle cx="75" cy="73" r="10" fill="#fef08a" opacity="0.5" filter="blur(2px)" />
    </motion.g>
  </svg>
);

/* 2. Beautiful Cartoon Bus */
const SceneBus = () => (
  <svg width="200" height="120" viewBox="0 0 200 120" fill="none">
    {/* Bouncing Bus Body */}
    <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}>
      {/* Shadow */}
      <ellipse cx="100" cy="110" rx="45" ry="5" fill="#e2dcc8" style={{ mixBlendMode: 'multiply' }} />
      {/* Bus Base */}
      <rect x="50" y="30" width="100" height="60" rx="15" fill="#fca5a5" />
      <rect x="50" y="55" width="100" height="35" rx="10" fill="#f87171" />
      {/* Windows */}
      <rect x="60" y="40" width="22" height="18" rx="4" fill="#bae6fd" />
      <rect x="85" y="40" width="22" height="18" rx="4" fill="#bae6fd" />
      <rect x="110" y="40" width="25" height="18" rx="4" fill="#bae6fd" />
      {/* Details */}
      <rect x="50" y="65" width="100" height="4" fill="#fee2e2" />
      <circle cx="145" cy="75" r="4" fill="#fef08a" />
      {/* Wheels spinning */}
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '75px 90px' }}>
        <circle cx="75" cy="90" r="12" fill="#334155" />
        <circle cx="75" cy="90" r="6" fill="#94a3b8" />
        <circle cx="75" cy="90" r="2" fill="#cbd5e1" />
        <line x1="75" y1="78" x2="75" y2="102" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="63" y1="90" x2="87" y2="90" stroke="#cbd5e1" strokeWidth="2" />
      </motion.g>
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '125px 90px' }}>
        <circle cx="125" cy="90" r="12" fill="#334155" />
        <circle cx="125" cy="90" r="6" fill="#94a3b8" />
        <circle cx="125" cy="90" r="2" fill="#cbd5e1" />
        <line x1="125" y1="78" x2="125" y2="102" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="113" y1="90" x2="137" y2="90" stroke="#cbd5e1" strokeWidth="2" />
      </motion.g>
    </motion.g>
    {/* Wind/Motion Lines */}
    <motion.g animate={{ x: [-20, 20], opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }}>
      <line x1="20" y1="50" x2="40" y2="50" stroke="#d1d5db" strokeWidth="3" strokeLinecap="round" />
      <line x1="10" y1="70" x2="35" y2="70" stroke="#d1d5db" strokeWidth="3" strokeLinecap="round" />
    </motion.g>
  </svg>
);

/* Cartoon Thought bubble with prejudice morphing */
const SceneThought = () => (
  <svg width="130" height="110" viewBox="0 0 130 110" fill="none">
    <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
      {/* Cloud Bubble */}
      <path d="M40 70 A 20 20 0 0 1 20 50 A 25 25 0 0 1 50 25 A 35 35 0 0 1 110 40 A 25 25 0 0 1 90 80 Q 65 85 40 70 Z" fill="#fce4ec" stroke="#fbcfe8" strokeWidth="3" />
      <circle cx="25" cy="85" r="8" fill="#fce4ec" />
      <circle cx="15" cy="100" r="5" fill="#fce4ec" />

      {/* Morphing Monster to Heart */}
      <AnimatePresence mode="wait">
        <motion.g key="monster" initial={{ opacity: 1 }} animate={{ opacity: [1, 1, 0, 0, 1] }} transition={{ duration: 4, repeat: Infinity }}>
          <rect x="50" y="40" width="30" height="25" rx="6" fill="#64748b" />
          <circle cx="58" cy="48" r="3" fill="white" />
          <circle cx="72" cy="48" r="3" fill="white" />
          <path d="M55 58 L75 58" stroke="white" strokeWidth="2" />
        </motion.g>
        <motion.g key="heart" initial={{ opacity: 0 }} animate={{ opacity: [0, 0, 1, 1, 0] }} transition={{ duration: 4, repeat: Infinity }}>
          <path d="M65 65 C65 65 50 50 50 38 C50 33 55 28 60 28 C62 28 65 31 65 31 C65 31 68 28 70 28 C75 28 80 33 80 38 C80 50 65 65 65 65 Z" fill="#fb7185" />
          <motion.circle cx="65" cy="40" r="3" fill="white" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 0.5, repeat: Infinity }} />
        </motion.g>
      </AnimatePresence>
    </motion.g>
  </svg>
);

/* Cartoon Different Shapes interacting */
const SceneShapes = () => (
  <svg width="140" height="90" viewBox="0 0 140 90" fill="none">
    <ellipse cx="70" cy="80" rx="40" ry="8" fill="#e2dcc8" style={{ mixBlendMode: 'multiply' }} opacity="0.3" />

    <motion.g animate={{ x: [0, 15, 0], rotate: [0, -10, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '35px 55px' }}>
      <circle cx="35" cy="55" r="25" fill="#a78bfa" />
      <path d="M25 50 Q30 45 35 50" stroke="#4c1d95" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M45 50 Q50 45 55 50" stroke="#4c1d95" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="40" cy="60" r="4" fill="#fbcfe8" />
    </motion.g>

    <motion.g animate={{ x: [0, -15, 0], rotate: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '105px 55px' }}>
      <polygon points="105,25 75,75 135,75" fill="#f472b6" />
      <path d="M95 55 Q100 50 105 55" stroke="#831843" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M115 55 Q120 50 125 55" stroke="#831843" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="110" cy="65" r="3" fill="#fbcfe8" />
    </motion.g>

    <motion.line x1="60" y1="55" x2="80" y2="55" stroke="#fbcfe8" strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round"
      animate={{ opacity: [0, 1, 0], scaleX: [0.5, 1.2, 0.5] }} transition={{ duration: 2, repeat: Infinity }} style={{ transformOrigin: '70px 55px' }} />
  </svg>
);

/* Cartoon Magnet characters attracting */
const SceneMagnets = () => (
  <svg width="160" height="100" viewBox="0 0 160 100" fill="none">
    {/* Shadow */}
    <ellipse cx="80" cy="90" rx="50" ry="10" fill="#e2dcc8" style={{ mixBlendMode: 'multiply' }} opacity="0.3" animate={{ scale: [1, 0.8, 1] }} transition={{ duration: 2.5, repeat: Infinity }} />

    {/* Magnet 1 (Blue) */}
    <motion.g animate={{ x: [0, 25, 0], rotate: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
      <path d="M15 30 L55 30 C 65 30 65 70 55 70 L15 70 Z" fill="#60a5fa" />
      <path d="M15 30 L30 30 L30 70 L15 70 Z" fill="#f87171" />
      <text x="18" y="55" fontSize="16" fill="white" fontWeight="bold">N</text>
      {/* Eye */}
      <circle cx="45" cy="45" r="4" fill="white" />
      <circle cx="46" cy="45" r="2" fill="black" />
    </motion.g>

    {/* Magnet 2 (Pink) */}
    <motion.g animate={{ x: [0, -25, 0], rotate: [0, -10, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
      <path d="M145 30 L105 30 C 95 30 95 70 105 70 L145 70 Z" fill="#f472b6" />
      <path d="M145 30 L130 30 L130 70 L145 70 Z" fill="#f87171" />
      <text x="133" y="55" fontSize="16" fill="white" fontWeight="bold">S</text>
      {/* Eye */}
      <circle cx="115" cy="45" r="4" fill="white" />
      <circle cx="114" cy="45" r="2" fill="black" />
    </motion.g>

    {/* Magnetic Magic Sparks */}
    <motion.g animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }} style={{ transformOrigin: '80px 50px' }}>
      <path d="M80 40 L80 60 M70 50 L90 50 M73 43 L87 57 M73 57 L87 43" stroke="#fef08a" strokeWidth="4" strokeLinecap="round" />
    </motion.g>
  </svg>
);

/* Elegant Storybook Mugs Clinking */
const SceneCups = () => (
  <svg width="160" height="130" viewBox="0 0 160 130" fill="none">
    {/* Soft Glow Behind */}
    <circle cx="80" cy="80" r="45" fill="#fbcfe8" opacity="0.3" filter="blur(10px)" />
    
    {/* Mug 1 (Left - Pink) */}
    <motion.g animate={{ rotate: [-6, 0, -6], x: [-3, 0, -3] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '40px 100px' }}>
      {/* Handle */}
      <path d="M40 55 C 20 50, 15 85, 40 85" stroke="#f472b6" strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* Body */}
      <path d="M40 40 L75 40 C 75 40 78 95 57 100 C 37 100 40 40 40 40 Z" fill="#fbcfe8" />
      {/* Top Opening & Liquid */}
      <ellipse cx="57.5" cy="40" rx="17.5" ry="6" fill="#fce4ec" />
      <ellipse cx="57.5" cy="41" rx="15" ry="4" fill="#a16207" />
      {/* Highlight */}
      <path d="M50 55 Q 45 75 52 90" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.7" fill="none" />
      {/* Steam */}
      <motion.path d="M50 30 C 45 20, 60 10, 55 0" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.6" fill="none"
        animate={{ y: [0, -10], opacity: [0, 0.6, 0] }} transition={{ duration: 2, repeat: Infinity }} />
    </motion.g>

    {/* Mug 2 (Right - Purple) */}
    <motion.g animate={{ rotate: [6, 0, 6], x: [3, 0, 3] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }} style={{ transformOrigin: '120px 100px' }}>
      {/* Handle */}
      <path d="M120 55 C 140 50, 145 85, 120 85" stroke="#a78bfa" strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* Body */}
      <path d="M85 40 L120 40 C 120 40 120 100 102 100 C 82 95 85 40 85 40 Z" fill="#e9d5ff" />
      {/* Top Opening & Liquid */}
      <ellipse cx="102.5" cy="40" rx="17.5" ry="6" fill="#f3e8ff" />
      <ellipse cx="102.5" cy="41" rx="15" ry="4" fill="#713f12" />
      {/* Highlight */}
      <path d="M110 55 Q 115 75 108 90" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.7" fill="none" />
      {/* Steam */}
      <motion.path d="M105 30 C 110 20, 95 10, 100 0" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.6" fill="none"
        animate={{ y: [0, -10], opacity: [0, 0.6, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
    </motion.g>

    {/* Clink Stars */}
    <motion.g animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0], rotate: [0, 90] }} transition={{ duration: 1.8, repeat: Infinity, delay: 0.8 }} style={{ transformOrigin: '80px 45px' }}>
      <path d="M80 35 L82 43 L90 45 L82 47 L80 55 L78 47 L70 45 L78 43 Z" fill="#fbbf24" />
      <circle cx="80" cy="45" r="8" fill="#fef08a" opacity="0.4" filter="blur(3px)" />
    </motion.g>
  </svg>
);

/* Storybook Birds (Friends) */
const SceneFriends = () => (
  <svg width="180" height="120" viewBox="0 0 180 120" fill="none">
    {/* Magical glowing branch */}
    <path d="M10 85 Q 90 100 170 75" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
    <path d="M30 88 Q 40 100 45 95" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
    <path d="M140 82 Q 150 95 160 90" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
    {/* Tiny leaves */}
    <ellipse cx="45" cy="95" rx="6" ry="3" fill="#a3e635" transform="rotate(-30 45 95)" />
    <ellipse cx="160" cy="90" rx="6" ry="3" fill="#a3e635" transform="rotate(30 160 90)" />

    {/* Bird 1 (Purple) */}
    <motion.g animate={{ y: [0, -3, 0], rotate: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '70px 75px' }}>
      {/* Tail */}
      <path d="M40 60 L25 75 L35 80 Z" fill="#a78bfa" />
      {/* Body */}
      <ellipse cx="55" cy="60" rx="18" ry="20" fill="#c4b5fd" />
      <ellipse cx="60" cy="58" rx="12" ry="15" fill="#f3e8ff" />
      {/* Wing */}
      <path d="M45 55 Q 35 70 50 75 Q 60 65 45 55" fill="#8b5cf6" />
      {/* Face */}
      <circle cx="65" cy="50" r="2.5" fill="#1e1b4b" />
      <path d="M72 55 L80 57 L72 59 Z" fill="#fbbf24" />
      {/* Cheek */}
      <circle cx="58" cy="54" r="3" fill="#fb7185" opacity="0.6" />
    </motion.g>

    {/* Bird 2 (Pink) */}
    <motion.g animate={{ y: [0, -3, 0], rotate: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }} style={{ transformOrigin: '110px 75px' }}>
      {/* Tail */}
      <path d="M140 60 L155 75 L145 80 Z" fill="#f472b6" />
      {/* Body */}
      <ellipse cx="125" cy="60" rx="18" ry="20" fill="#fbcfe8" />
      <ellipse cx="120" cy="58" rx="12" ry="15" fill="#fdf2f8" />
      {/* Wing */}
      <path d="M135 55 Q 145 70 130 75 Q 120 65 135 55" fill="#ec4899" />
      {/* Face */}
      <circle cx="115" cy="50" r="2.5" fill="#4c0519" />
      <path d="M108 55 L100 57 L108 59 Z" fill="#fbbf24" />
      {/* Cheek */}
      <circle cx="122" cy="54" r="3" fill="#fb7185" opacity="0.6" />
    </motion.g>

    {/* Floating Heart */}
    <motion.g animate={{ y: [0, -10], opacity: [0, 1, 0], scale: [0.5, 1.2, 0.8] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }} style={{ transformOrigin: '90px 40px' }}>
      <path d="M90 40 C 90 40 82 30 90 25 C 98 30 90 40 90 40 Z" fill="#f43f5e" />
    </motion.g>
  </svg>
);

/* Cartoon Laughing Creature */
const SceneLaugh = () => (
  <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
    <motion.g animate={{ rotate: [-5, 5, -5], scale: [1, 1.05, 1], y: [0, -5, 0] }} transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '70px 70px' }}>
      {/* Fluffy body */}
      <path d="M70 20 C110 20 120 50 120 70 C120 110 100 120 70 120 C40 120 20 110 20 70 C20 50 30 20 70 20 Z" fill="#fcd34d" />
      {/* Eyes squeezed shut */}
      <path d="M45 55 Q55 45 60 55" stroke="#78350f" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M80 55 Q90 45 95 55" stroke="#78350f" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Huge laughing mouth */}
      <path d="M40 75 Q70 110 100 75 Z" fill="#b91c1c" />
      <path d="M45 75 Q70 90 95 75 Z" fill="#f87171" />
      {/* Flying tears */}
      <motion.circle cx="30" cy="50" r="5" fill="#38bdf8" animate={{ x: [-10, -20], y: [-10, 10], opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} />
      <motion.circle cx="110" cy="50" r="4" fill="#38bdf8" animate={{ x: [10, 20], y: [-10, 10], opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }} />
    </motion.g>
  </svg>
);

/* Cartoon Beautiful Shooting Star */
const SceneSpecial = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
    {/* Rainbow trail */}
    <motion.g animate={{ x: [-10, 10, -10], y: [10, -10, 10] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
      <path d="M60 60 Q 20 80 10 110" stroke="#fbcfe8" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M65 65 Q 30 90 20 115" stroke="#c4b5fd" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M70 70 Q 40 100 30 115" stroke="#fef08a" strokeWidth="8" strokeLinecap="round" fill="none" />
    </motion.g>

    {/* Star character */}
    <motion.g animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '60px 60px' }}>
<path d="M60 20 L68 45 L95 45 L73 60 L82 85 L60 70 L38 85 L47 60 L25 45 L52 45 Z" fill="#fbbf24" />
      <path d="M60 25 L66 42 L85 46 L71 58 L77 75 L60 65 L43 75 L49 58 L35 46 L54 42 Z" fill="#fef08a" />
      {/* Cute face */}
      <circle cx="53" cy="55" r="3" fill="#78350f" />
      <circle cx="67" cy="55" r="3" fill="#78350f" />
      <path d="M57 60 Q60 65 63 60" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="48" cy="58" r="2" fill="#fb7185" opacity="0.6" />
      <circle cx="72" cy="58" r="2" fill="#fb7185" opacity="0.6" />
    </motion.g>

    {/* Mini stars orbiting */}
    <motion.path d="M85 30 L88 40 L98 40 L90 47 L93 57 L85 52 L77 57 L80 47 L72 40 L82 40 Z" fill="#fef08a"
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5], rotate: 180 }} transition={{ duration: 2, repeat: Infinity }} />
    <motion.path d="M30 30 L32 36 L38 36 L33 40 L35 46 L30 42 L25 46 L27 40 L22 36 L28 36 Z" fill="#fbcfe8"
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], rotate: -180 }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
  </svg>
);

/* Magical Floating Polaroid (Memory) */
const SceneMemory = () => (
  <svg width="150" height="150" viewBox="0 0 150 150" fill="none">
    <ellipse cx="75" cy="135" rx="50" ry="10" fill="#e2dcc8" style={{ mixBlendMode: 'multiply' }} opacity="0.3" />
    <motion.g animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '75px 75px' }}>
      <rect x="35" y="30" width="80" height="90" fill="#ffffff" rx="4" stroke="#e2e8f0" strokeWidth="2" />
      <rect x="42" y="38" width="66" height="55" fill="#fbcfe8" />
      {/* Simple painted memory view */}
      <path d="M42 93 L60 70 L80 90 L95 80 L108 93 Z" fill="#f472b6" />
      <circle cx="90" cy="50" r="8" fill="#fef08a" />
      <circle cx="50" cy="50" r="3" fill="#ffffff" />
      <circle cx="65" cy="45" r="2" fill="#ffffff" />
      
      {/* Heart pinned on it */}
      <path d="M75 105 C 75 105 70 100 75 97 C 80 100 75 105 75 105 Z" fill="#ef4444" />
    </motion.g>
    {/* Floating light orbs */}
    <motion.circle cx="40" cy="50" r="4" fill="#fbbf24" animate={{ y: [0, -20], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }} />
    <motion.circle cx="110" cy="70" r="3" fill="#fbbf24" animate={{ y: [0, -20], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} />
  </svg>
);

/* Magical Dandelion / Wishing Seed */
const SceneDandelion = () => (
  <svg width="140" height="150" viewBox="0 0 140 150" fill="none">
    {/* Stalk */}
    <path d="M70 140 Q 60 100 65 70" stroke="#bef264" strokeWidth="4" strokeLinecap="round" fill="none" />
    
    {/* Center puff */}
    <circle cx="65" cy="70" r="10" fill="#fef9c3" />
    
    {/* Bursting Seeds */}
    <motion.g animate={{ rotate: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '65px 70px' }}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <line key={i} x1="65" y1="70" x2={65 + 30 * Math.cos(deg * Math.PI / 180)} y2={70 + 30 * Math.sin(deg * Math.PI / 180)} stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
      ))}
    </motion.g>

    {/* Floating wishes */}
    <motion.g animate={{ x: [0, 20, 40], y: [0, -30, -60], opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}>
      <path d="M75 55 L85 45 M85 45 L90 50 M85 45 L80 40" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
      <circle cx="85" cy="45" r="2" fill="#fbbf24" filter="blur(1px)" />
    </motion.g>
    <motion.g animate={{ x: [0, 20, 30], y: [0, -20, -50], opacity: [0, 1, 0], scale: [0.5, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 1.5 }}>
      <path d="M90 65 L100 55 M100 55 L105 60 M100 55 L95 50" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
      <circle cx="100" cy="55" r="2" fill="#fbbf24" filter="blur(1px)" />
    </motion.g>
  </svg>
);

/* Glowing Unique Diamond/Lotus */
const SceneDiamond = () => (
  <svg width="140" height="150" viewBox="0 0 140 150" fill="none">
    {/* Base glow */}
    <circle cx="70" cy="75" r="40" fill="#a78bfa" opacity="0.3" filter="blur(15px)" />
    
    <motion.g animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '70px 75px' }}>
      {/* Gem back facets */}
      <path d="M70 120 L30 65 L50 35 Z" fill="#d8b4fe" />
      <path d="M70 120 L110 65 L90 35 Z" fill="#b196c1" />
      {/* Front facets */}
      <path d="M70 120 L30 65 L70 50 Z" fill="#a855f7" />
      <path d="M70 120 L110 65 L70 50 Z" fill="#9333ea" />
      <path d="M30 65 L50 35 L70 50 Z" fill="#d8b4fe" />
      <path d="M110 65 L90 35 L70 50 Z" fill="#c084fc" />
      {/* Top facet */}
      <path d="M50 35 L90 35 L70 50 Z" fill="#f3e8ff" />
      
      {/* Shimmer line */}
      <motion.path d="M35 60 L65 110" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.8" fill="none"
        animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} />
    </motion.g>

    {/* Sparkles */}
    <motion.path d="M100 40 L105 25 M95 30 L110 35" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" 
      animate={{ scale: [0, 1.5, 0], rotate: [0, 90] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} style={{ transformOrigin: '100px 32px' }} />
  </svg>
);

/* Cake — kept for ending */
const SvgCake = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <ellipse cx="50" cy="88" rx="38" ry="8" fill="#f3e8ff" />
    <rect x="14" y="60" width="72" height="28" rx="8" fill="#fce4ec" />
    <rect x="14" y="60" width="72" height="10" rx="4" fill="#f9a8d4" fillOpacity="0.6" />
    <rect x="22" y="36" width="56" height="26" rx="7" fill="#e9d5ff" />
    <rect x="22" y="36" width="56" height="9" rx="4" fill="#c084fc" fillOpacity="0.5" />
    <rect x="31" y="18" width="38" height="20" rx="6" fill="#fde68a" fillOpacity="0.85" />
    {[18, 28, 38, 48, 58, 68, 78].map((x, i) => <ellipse key={i} cx={x} cy={60} rx="3.5" ry="5" fill="white" fillOpacity="0.7" />)}
    {[26, 36, 46, 56, 66].map((x, i) => <ellipse key={i} cx={x} cy={36} rx="3" ry="4.5" fill="white" fillOpacity="0.6" />)}
    <rect x="38" y="7" width="5" height="13" rx="2.5" fill="#f9a8d4" />
    <rect x="48" y="5" width="5" height="15" rx="2.5" fill="#c084fc" />
    <rect x="58" y="8" width="5" height="12" rx="2.5" fill="#86efac" />
    <ellipse cx="40.5" cy="6" rx="2.5" ry="4" fill="#fbbf24" />
    <ellipse cx="50.5" cy="4" rx="2.5" ry="4" fill="#fb923c" />
    <ellipse cx="60.5" cy="7" rx="2.5" ry="4" fill="#f472b6" />
    <circle cx="25" cy="72" r="2" fill="#fde68a" />
    <circle cx="75" cy="70" r="2" fill="#fde68a" />
  </svg>
);

/* Simple SVG Heart for ending */
const SvgHeart = ({ size = 40, color = '#c084fc' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M20 35C20 35 5 25 5 14C5 9.5 8.5 6 12.5 6C15.5 6 18 7.8 20 10C22 7.8 24.5 6 27.5 6C31.5 6 35 9.5 35 14C35 25 20 35 20 35Z" fill={color} />
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   PARTICLES
═══════════════════════════════════════════════════════════ */
const gentleConfig = {
  background: { color: { value: 'transparent' } }, fpsLimit: 60,
  particles: {
    color: { value: ['#ffffff', '#fff9c4', '#fce4ec', '#d4b8f0'] },
    move: { enable: true, direction: 'none', speed: 0.3, random: true, outModes: { default: 'out' } },
    number: { value: 60, density: { enable: true, area: 800 } },
    opacity: { value: { min: 0.1, max: 0.8 }, animation: { enable: true, speed: 0.5, sync: false } },
    shape: { type: 'circle' },
    size: { value: { min: 1, max: 3 }, animation: { enable: true, speed: 1, sync: false } },
    twinkle: { particles: { enable: true, color: '#ffffff', frequency: 0.05, opacity: 1 } }
  }, detectRetina: true,
};
const confettiConfig = {
  background: { color: { value: 'transparent' } }, fpsLimit: 60,
  emitters: [
    { direction: 'top-right', rate: { delay: 0.05, quantity: 8 }, position: { x: 0, y: 100 }, size: { width: 0, height: 0 } },
    { direction: 'top-left', rate: { delay: 0.05, quantity: 8 }, position: { x: 100, y: 100 }, size: { width: 0, height: 0 } },
  ],
  particles: {
    color: { value: ['#f76b8a', '#ff9ff3', '#feca57', '#48dbfb', '#a29bfe', '#ffffff'] },
    move: { decay: 0.04, direction: 'top', enable: true, gravity: { enable: true, acceleration: 8 }, speed: { min: 12, max: 28 }, outModes: { top: 'none', default: 'destroy' } },
    number: { value: 0 }, opacity: { value: { min: 0.4, max: 1 } },
    rotate: { value: { min: 0, max: 360 }, direction: 'random', animation: { enable: true, speed: 40 } },
    shape: { type: ['circle', 'square', 'triangle', 'star'] }, size: { value: { min: 5, max: 10 } },
    wobble: { distance: 25, enable: true, move: true, speed: { min: -18, max: 18 } },
  }, detectRetina: true,
};

const ease = [0.25, 0.46, 0.45, 0.94];

/* ═══════════════════════════════════════════════════════════
   STORY DATA — each line maps to its contextual animation
═══════════════════════════════════════════════════════════ */
const storyLines = [
  { text: 'Yo sé que tal vez no tenemos tanto tiempo de conocernos...', Scene: ScenePaths },
  { text: 'pero nunca se me va a olvidar la primera vez que te vi llegar en el transporte para el trabajo.', Scene: SceneBus },
  { text: 'En ese momento me llené de muchos prejuicios...', Scene: SceneThought },
  { text: '...que al final, no tenían nada que ver contigo.', Scene: SceneThought },
  { text: 'Con el tiempo fuimos coincidiendo cada vez más...', Scene: ScenePaths },
  { text: 'aunque realmente no tengamos muchas cosas en común y seamos muy diferentes.', Scene: SceneShapes },
  { text: 'Pero tal vez eso fue justamente lo que nos acercó más...', Scene: SceneMagnets },
  { text: '...porque los polos opuestos se atraen.', Scene: SceneMagnets },
  { text: 'Fuimos compartiendo más y más...', Scene: SceneCups },
  { text: 'y para no hacerlo largo, ahora somos amigos.', Scene: SceneFriends },
  { text: 'Y sinceramente me alegra mucho haberte conocido, aunque a veces no te soporto jajajaja.', Scene: SceneLaugh },
  { text: '...pero eres una persona muy especial y diferente a cualquiera que haya conocido antes.', Scene: SceneSpecial },
  { text: 'En tu cumpleaños quería recordarte lo importante que eres y agradecerte por cada conversación, cada risa y cada momento compartido.', Scene: SceneMemory },
  { text: 'Espero que hoy la pases increíble, que recibas mucho cariño y que todos tus deseos se vayan cumpliendo poco a poco.', Scene: SceneDandelion },
  { text: 'Nunca cambies esa forma tan única de ser.', Scene: SceneDiamond },
];

/* ═══════════════════════════════════════════════════════════
   WELCOME
═══════════════════════════════════════════════════════════ */
const floaterPositions = [
  { x: '8%', y: '12%' }, { x: '22%', y: '74%' }, { x: '40%', y: '20%' },
  { x: '58%', y: '78%' }, { x: '72%', y: '15%' }, { x: '85%', y: '62%' }, { x: '92%', y: '38%' },
];

function Welcome({ onStart }) {
  return (
    <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }} transition={{ duration: 1 }}
      className="min-h-screen flex flex-col justify-center items-center text-center p-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 30%, #581c87 60%, #9333ea 85%, #f43f5e 100%)' }}>

      {floaterPositions.map(({ x, y }, i) => (
        <motion.div key={i} className="absolute select-none pointer-events-none"
          style={{ left: x, top: y }}
          animate={{ y: [0, -16, 0], opacity: [0.15, 0.45, 0.15], rotate: [-8, 8, -8] }}
          transition={{ repeat: Infinity, duration: 3.5 + i * 0.4, delay: i * 0.3, ease: 'easeInOut' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L15.5 12.5L26 14L15.5 15.5L14 26L12.5 15.5L2 14L12.5 12.5L14 2Z"
              fill={['#c084fc', '#f472b6', '#818cf8', '#fbbf24', '#86efac', '#f9a8d4', '#a29bfe'][i]} />
          </svg>
        </motion.div>
      ))}

      <motion.div animate={{ scale: [1, 1.12, 1], y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut' }}
        className="mb-8 select-none z-10" style={{ filter: 'drop-shadow(0 8px 24px rgba(192,132,252,0.5))' }}>
        <svg width="110" height="95" viewBox="0 0 110 95" fill="none">
          <path d="M55 88C55 88 8 62 8 32C8 20 16 12 27 12C35 12 42 16 55 26C68 16 75 12 83 12C94 12 102 20 102 32C102 62 55 88 55 88Z"
            fill="url(#hg)" />
          <path d="M55 88C55 88 8 62 8 32C8 20 16 12 27 12C35 12 42 16 55 26C68 16 75 12 83 12C94 12 102 20 102 32C102 62 55 88 55 88Z"
            fill="url(#hg2)" />
          <defs>
            <radialGradient id="hg" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#e879f9" /><stop offset="100%" stopColor="#7c3aed" />
            </radialGradient>
            <radialGradient id="hg2" cx="30%" cy="25%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.35" /><stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>

      <motion.div className="z-10 mb-12">
        {['Un', 'Regalo', 'Especial'].map((word, i) => (
          <motion.span key={i} initial={{ opacity: 0, y: 35, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.3 + i * 0.2, duration: 0.95, ease }}
            className="inline-block mr-3 text-5xl md:text-7xl font-quicksand font-bold text-purple-900 drop-shadow-md">
            {word}
          </motion.span>
        ))}
      </motion.div>

      <motion.button initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, type: 'spring', stiffness: 180, damping: 14 }}
        whileHover={{ scale: 1.07, boxShadow: '0 0 45px rgba(162,155,254,0.6)' }}
        whileTap={{ scale: 0.94 }} onClick={onStart}
        className="z-10 px-14 py-5 font-quicksand font-extrabold text-white text-2xl rounded-full shadow-2xl border-2 border-white/30 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#a29bfe,#e17bf8,#f76b8a)' }}>
        <motion.span className="absolute inset-0 pointer-events-none"
          animate={{ x: ['-100%', '120%'] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', repeatDelay: 1 }}
          style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)', width: '60%' }} />
        Abrir Sorpresa
      </motion.button>

      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.5, duration: 1.1 }}
        className="absolute bottom-0 left-0 right-0 h-[3px] origin-left"
        style={{ background: 'linear-gradient(90deg,transparent,#a29bfe,#f76b8a,transparent)' }} />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ENVELOPE SCENE
═══════════════════════════════════════════════════════════ */
function EnvelopeScene({ onOpen }) {
  const [opened, setOpened] = useState(false);
  const handleOpen = () => { if (opened) return; setOpened(true); setTimeout(onOpen, 2400); };

  return (
    <motion.div key="envelope" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(6px)' }} transition={{ duration: 0.8 }}
      className="min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)' }}>

      {/* Falling petals */}
      {[['18%', '#fbbf24'], ['40%', '#f472b6'], ['62%', '#c084fc'], ['80%', '#fb7185']].map(([x, c], i) => (
        <motion.div key={i} className="absolute select-none pointer-events-none" style={{ left: x }}
          animate={{ y: ['-8vh', '108vh'], opacity: [0, 0.6, 0], rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 7 + i * 1.5, delay: i * 1.3, ease: 'linear' }}>
          <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
            {[0, 60, 120, 180, 240, 300].map((a, j) => (
              <ellipse key={j} cx={18 + 7 * Math.cos(a * Math.PI / 180)} cy={18 + 7 * Math.sin(a * Math.PI / 180)}
                rx="5" ry="7" transform={`rotate(${a},${18 + 7 * Math.cos(a * Math.PI / 180)},${18 + 7 * Math.sin(a * Math.PI / 180)})`}
                fill={c} fillOpacity="0.8" />
            ))}
            <circle cx="18" cy="18" r="5" fill="#fde68a" />
          </svg>
        </motion.div>
      ))}

      <motion.div
        animate={opened ? { scale: [1, 1.08, 0.9, 0], opacity: [1, 1, 1, 0], y: [0, -20, 20, -220] } : { y: [0, -10, 0] }}
        transition={opened ? { duration: 1.8, ease: 'easeInOut' } : { repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        onClick={handleOpen} className="cursor-pointer z-10 relative select-none"
        style={{ filter: 'drop-shadow(0 20px 40px rgba(162,155,254,0.45))' }}>
        <svg width="288" height="176" viewBox="0 0 288 176" fill="none">
          <rect x="2" y="2" width="284" height="172" rx="16" fill="url(#eg)" stroke="white" strokeOpacity="0.5" strokeWidth="3" />
          <motion.polygon points="2,2 144,88 286,2" fill="url(#fg)"
            animate={opened ? { scaleY: 0, opacity: 0 } : { scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'backOut' }} />
          <line x1="2" y1="174" x2="144" y2="88" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" />
          <line x1="286" y1="174" x2="144" y2="88" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" />
          {!opened && <>
            <circle cx="144" cy="100" r="28" fill="url(#sg)" stroke="white" strokeOpacity="0.7" strokeWidth="3" />
            <circle cx="144" cy="100" r="20" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M144 112 C144 112 132 104 132 97C132 93.5 134.5 91 137.5 91C140 91 142 92.5 144 95C146 92.5 148 91 150.5 91C153.5 91 156 93.5 156 97C156 104 144 112 144 112Z" fill="white" fillOpacity="0.85" />
          </>}
          {opened && <motion.circle cx="144" cy="88" r="60" fill="white"
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 0.9, 0], scale: [0, 1, 2] }}
            transition={{ duration: 1.3 }} />}
          <defs>
            <linearGradient id="eg" x1="0" y1="0" x2="288" y2="176" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fce4ec" /><stop offset="1" stopColor="#e8d5f5" />
            </linearGradient>
            <linearGradient id="fg" x1="0" y1="0" x2="288" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#d4b8f0" /><stop offset="1" stopColor="#f2c9e2" />
            </linearGradient>
            <radialGradient id="sg" cx="38%" cy="35%" r="65%">
              <stop stopColor="#e17bf8" /><stop offset="1" stopColor="#7c3aed" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>

      <motion.p animate={opened ? { opacity: 0 } : { opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2.2 }}
        className="mt-10 font-quicksand font-bold text-purple-500 text-xl tracking-widest z-10">
        TOCA EL SOBRE
      </motion.p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TRUE 3D BOOK / STORY
═══════════════════════════════════════════════════════════ */
function Book({ onNext }) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = storyLines.length;

  const next = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    else onNext(); // Extra click at the end closes it
  };

  const prev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <motion.div key="book-scene" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-4"
      style={{ background: 'linear-gradient(180deg, #09090b 0%, #17171e 50%, #1e1b4b 100%)' }}>

      {/* Ambiance */}
      <div className="absolute w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: '#a29bfe', left: '-5%', top: '-10%', opacity: 0.15 }} />
      <div className="absolute w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: '#f76b8a', right: '-5%', bottom: '-10%', opacity: 0.1 }} />

      {/* 3D Book Wrapper */}
      <motion.div
        initial={{ rotateX: 25, rotateY: -5, y: 30, opacity: 0 }}
        animate={{ rotateX: 15, rotateY: 0, y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative w-full max-w-[95vw] md:max-w-5xl h-[70vh] md:h-[600px]"
        style={{ perspective: '2000px', transformStyle: 'preserve-3d' }}
      >
        {/* Book Covers (Backdrop to give it thickness) */}
        <div className="absolute inset-x-[-10px] inset-y-[-10px] bg-amber-950 rounded-xl shadow-2xl" style={{ transform: 'translateZ(-15px)' }} />
        <div className="absolute inset-x-2 inset-y-[-5px] bg-[#e2dcc8] rounded-xl" style={{ transform: 'translateZ(-5px)' }} />

        {/* Spine Shadow Inside */}
        <div className="absolute left-1/2 top-0 bottom-0 w-16 -ml-8 bg-gradient-to-r from-transparent via-black/20 to-transparent z-0 pointer-events-none" style={{ transform: 'translateZ(1px)' }} />

        {/* Permanent Left Base Page (Spread 0 Scene) */}
        <div className="absolute top-0 left-0 bottom-0 w-1/2 bg-[#fdfaf1] rounded-l-md border-l border-[#e2dcc8] flex items-center justify-center p-8 overflow-hidden z-0">
          <div className="scale-125 md:scale-150 drop-shadow-xl">
            {React.createElement(storyLines[0].Scene)}
          </div>
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }} />
        </div>

        {/* Permanent Right Base Page (End Blank) */}
        <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-[#fdfaf1] rounded-r-md border-r border-[#e2dcc8] flex flex-col items-center justify-center p-8 z-0">
          <p className="text-3xl font-quicksand font-bold text-amber-900/30 text-center mb-8">Fin de la historia.</p>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onNext}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-lg relative z-50 pointer-events-auto"
          >
            Abrir Sorpresa Final
          </motion.button>
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }} />
        </div>

        {/* The Flipping Leaves */}
        {storyLines.map((line, i) => {
          const isFlipped = currentPage > i;

          return (
            <motion.div
              key={i}
              className="absolute top-0 right-0 bottom-0 w-1/2 origin-left"
              style={{ transformStyle: 'preserve-3d', zIndex: isFlipped ? i + 10 : 50 - i }}
              initial={false}
              animate={{ rotateY: isFlipped ? -180 : 0 }}
              transition={{ duration: 1.4, ease: [0.645, 0.045, 0.355, 1] }}
            >
              {/* FRONT FACE (Right Page of Spread i) */}
              <div
                className="absolute inset-0 bg-[#fdfaf1] rounded-r-md border-y border-r border-black/5 flex flex-col justify-center p-8 md:p-14 overflow-hidden shadow-[-5px_0_15px_rgba(0,0,0,0.05)]"
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }} />

                <div className="mb-6 text-amber-900/50 font-quicksand font-bold text-sm tracking-[0.3em] uppercase">Página {i + 1}</div>
                <p className="text-2xl md:text-3xl lg:text-4xl font-quicksand font-bold text-amber-950 leading-relaxed italic relative">
                  <span className="text-5xl lg:text-6xl absolute -left-6 -top-6 text-amber-900/10 font-serif">“</span>
                  {line.text}
                  <span className="text-5xl lg:text-6xl absolute -bottom-10 text-amber-900/10 font-serif">”</span>
                </p>
                <div className="mt-auto flex justify-between items-center text-amber-900/40 font-quicksand font-bold text-xs pt-8 border-t border-amber-900/10">
                  <span className="tracking-widest">PARA LA DEI</span>
                  <span>2026</span>
                </div>
              </div>

              {/* BACK FACE (Left Page of Spread i+1) */}
              <div
                className="absolute inset-0 bg-[#fdfaf1] rounded-l-md border-y border-l border-black/5 flex items-center justify-center p-8 overflow-hidden shadow-[5px_0_15px_rgba(0,0,0,0.05)]"
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }} />

                <div className="scale-125 md:scale-150 drop-shadow-lg">
                  {storyLines[i + 1] ? React.createElement(storyLines[i + 1].Scene) : null}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Global Book Shadows underneath */}
        <div className="absolute -bottom-10 left-10 right-10 h-10 bg-black/40 blur-3xl rounded-full z-0 pointer-events-none" />

        {/* Navigation Click Zones */}
        <div className="absolute inset-0 flex z-50 pointer-events-none" style={{ transform: 'translateZ(20px)' }}>
          <div onClick={prev} className="w-1/2 h-full cursor-pointer pointer-events-auto group/left border-none outline-none">
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-opacity duration-300 bg-amber-950/20 p-4 rounded-full text-white text-2xl backdrop-blur-md ${currentPage === 0 ? 'opacity-0' : 'opacity-0 group-hover/left:opacity-100'}`}>←</div>
          </div>
          <div onClick={next} className="w-1/2 h-full cursor-pointer pointer-events-auto group/right border-none outline-none">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity duration-300 bg-amber-950/20 p-4 rounded-full text-white text-2xl backdrop-blur-md opacity-0 group-hover/right:opacity-100">→</div>
          </div>
        </div>
      </motion.div>

      {/* Hints */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} className="mt-12 text-white/40 font-quicksand font-bold text-sm tracking-widest flex items-center gap-4">
        <span>← ATRÁS</span>
        <div className="h-[1px] w-12 bg-white/20" />
        <span>PASAR PÁGINA →</span>
      </motion.div>


    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ENDING
═══════════════════════════════════════════════════════════ */
function Ending() {
  const sparklePositions = Array.from({ length: 14 }, (_, i) => ({
    left: `${(i * 7.3) % 95}%`, top: `${(i * 11.7) % 90}%`,
    color: ['#fde68a', '#f9a8d4', '#c4b5fd', '#86efac'][i % 4],
    size: 14 + (i % 3) * 6, dur: 2.5 + i % 4, delay: (i * 0.3) % 3
  }));

  return (
    <motion.div key="ending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
      className="min-h-screen flex flex-col justify-center items-center p-6 text-center relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #020617 0%, #0f172a 40%, #1e1b4b 70%, #312e81 100%)' }}>

      {[['#a29bfe', '20%', '10%'], ['#f76b8a', '70%', '70%'], ['#feca57', '50%', '85%']].map(([c, l, t], i) => (
        <motion.div key={i} className="absolute rounded-full blur-3xl pointer-events-none"
          style={{ width: 350, height: 350, background: c, left: l, top: t, opacity: 0.18 }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.14, 0.28, 0.14] }}
          transition={{ repeat: Infinity, duration: 5 + i, delay: i * 1.2, ease: 'easeInOut' }} />
      ))}

      {sparklePositions.map((s, i) => (
        <motion.div key={i} className="absolute pointer-events-none" style={{ left: s.left, top: s.top }}
          animate={{ opacity: [0, 0.7, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ repeat: Infinity, duration: s.dur, delay: s.delay }}>
          <svg width={s.size} height={s.size} viewBox="0 0 28 28" fill="none">
            <path d="M14 2L15.5 12.5L26 14L15.5 15.5L14 26L12.5 15.5L2 14L12.5 12.5L14 2Z" fill={s.color} />
          </svg>
        </motion.div>
      ))}

      <motion.div initial={{ scale: 0.3, opacity: 0, rotateY: -30 }} animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        className="z-10 bg-white/20 backdrop-blur-xl border border-white/30 rounded-[50px] px-10 py-16 md:p-20 shadow-2xl mx-2"
        style={{ boxShadow: '0 30px 100px rgba(0,0,0,0.4),0 0 0 1px rgba(255,255,255,0.2)' }}>

        <motion.div animate={{ y: [0, -18, 0], rotate: [0, 4, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          className="mb-8 select-none flex justify-center drop-shadow-2xl">
          <SvgCake size={110} />
        </motion.div>



        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }}
          className="text-2xl md:text-3xl font-nunito font-bold text-white/90 mb-6 drop-shadow-md leading-relaxed max-w-xl mx-auto">
          Nunca cambies esa forma tan única de ser.
        </motion.p>

        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, type: 'spring', bounce: 0.55 }}
          className="font-quicksand font-extrabold text-3xl md:text-4xl tracking-widest drop-shadow-lg flex items-center justify-center gap-3"
          style={{ color: '#feca57', textShadow: '0 0 20px rgba(254,202,87,0.6)' }}>
          I Purple You
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
            <SvgHeart size={44} color="#c084fc" />
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.8 }}
          className="flex justify-center flex-wrap gap-4 mt-10">
          {Array.from({ length: 7 }, (_, i) => (
            <motion.div key={i} animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.15, ease: 'easeInOut' }}
              className="select-none">
              <SceneFriends />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.8, duration: 1.2 }}
        className="absolute bottom-0 left-0 right-0 h-[3px] origin-center"
        style={{ background: 'linear-gradient(90deg,transparent,#feca57,#f76b8a,#a29bfe,transparent)' }} />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [step, setStep] = useState(0);
  const [particlesReady, setParticlesReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async e => { await loadSlim(e); }).then(() => setParticlesReady(true));
  }, []);

  const nextStep = useCallback(() => { window.scrollTo({ top: 0 }); setStep(s => s + 1); }, []);
  const goToStep = useCallback((n) => { window.scrollTo({ top: 0 }); setStep(n); }, []);

  const start = useCallback(() => {
    const a = document.getElementById('bgMusic');
    if (a) { a.volume = 0.4; a.play().catch(() => { }); }
    nextStep();
  }, [nextStep]);

  return (
    <div className="min-h-screen relative font-nunito overflow-x-hidden">
      {particlesReady && step !== 3 && (
        <Particles id="tsparticles" options={step === 4 ? confettiConfig : gentleConfig}
          className="fixed inset-0 z-0 pointer-events-none" />
      )}
      <AnimatePresence mode="wait">
        {step === 0 && <Welcome key="w" onStart={start} />}
        {step === 1 && <EnvelopeScene key="e" onOpen={nextStep} />}
        {step === 2 && <Book key="l" onNext={nextStep} />}
        {step === 3 && <BirthdayScene3D key="3d" onBack={() => goToStep(4)} />}
        {step === 4 && <Ending key="end" />}
      </AnimatePresence>
    </div>
  );
}