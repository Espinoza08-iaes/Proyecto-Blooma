import React from 'react';

interface BloomaLogoProps {
  variant?: 'sprout' | 'flower' | 'butterfly' | 'sun';
  className?: string;
}

export default function BloomaLogo({ variant = 'sprout', className = 'h-8 w-8' }: BloomaLogoProps) {
  return (
    <svg
      className={`${className} transition-all duration-500`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Dynamic theme gradients referencing index.css CSS variables */}
        <linearGradient id="logo-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-primary-400, #2dd4bf)" />
          <stop offset="100%" stopColor="var(--color-primary-600, #0d9488)" />
        </linearGradient>
        <linearGradient id="logo-grad-secondary" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff8787" />
          <stop offset="100%" stopColor="var(--color-earth-400, #b5838d)" />
        </linearGradient>
      </defs>

      {/* Render selected vector icon shape */}
      {variant === 'sprout' && (
        <>
          {/* Sprout Stem */}
          <path
            d="M50 85 C50 60, 47 40, 53 25"
            stroke="url(#logo-grad-primary)"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
          {/* Leaf Left */}
          <path
            d="M50 55 C32 48, 20 32, 26 22 C37 16, 47 32, 50 55 Z"
            fill="url(#logo-grad-primary)"
            opacity="0.9"
          />
          {/* Leaf Right */}
          <path
            d="M50 42 C68 36, 80 20, 74 12 C63 6, 53 22, 50 42 Z"
            fill="url(#logo-grad-secondary)"
            opacity="0.9"
          />
        </>
      )}

      {variant === 'flower' && (
        <>
          {/* Glowing central core */}
          <circle cx="50" cy="50" r="16" fill="url(#logo-grad-primary)" />
          
          {/* 8 Overlapping layered petals */}
          <path d="M50 15 C58 35, 42 35, 50 15 Z" fill="url(#logo-grad-secondary)" opacity="0.85" />
          <path d="M50 85 C58 65, 42 65, 50 85 Z" fill="url(#logo-grad-secondary)" opacity="0.85" />
          <path d="M15 50 C35 58, 35 42, 15 50 Z" fill="url(#logo-grad-primary)" opacity="0.85" />
          <path d="M85 50 C65 58, 65 42, 85 50 Z" fill="url(#logo-grad-primary)" opacity="0.85" />
          
          <path d="M25 25 C40 38, 30 42, 25 25 Z" fill="url(#logo-grad-secondary)" opacity="0.70" />
          <path d="M75 75 C60 62, 70 58, 75 75 Z" fill="url(#logo-grad-secondary)" opacity="0.70" />
          <path d="M75 25 C60 38, 70 42, 75 25 Z" fill="url(#logo-grad-primary)" opacity="0.70" />
          <path d="M25 75 C40 62, 30 58, 25 75 Z" fill="url(#logo-grad-primary)" opacity="0.70" />
        </>
      )}

      {variant === 'butterfly' && (
        <>
          {/* Symmetrical wings */}
          <path
            d="M47 35 C28 10, 8 16, 14 43 C20 58, 47 48, 47 48 Z"
            fill="url(#logo-grad-secondary)"
            opacity="0.85"
          />
          <path
            d="M47 48 C28 48, 12 53, 18 69 C24 79, 47 63, 47 63 Z"
            fill="url(#logo-grad-primary)"
            opacity="0.70"
          />
          <path
            d="M53 35 C72 10, 92 16, 86 43 C80 58, 53 48, 53 48 Z"
            fill="url(#logo-grad-secondary)"
            opacity="0.85"
          />
          <path
            d="M53 48 C72 48, 88 53, 82 69 C76 79, 53 63, 53 63 Z"
            fill="url(#logo-grad-primary)"
            opacity="0.70"
          />
          
          {/* Center torso body */}
          <rect x="47" y="22" width="6" height="52" rx="3" fill="url(#logo-grad-primary)" />
          
          {/* Thin elegant antennae */}
          <path
            d="M48 22 C44 12, 36 14, 36 18"
            stroke="url(#logo-grad-secondary)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M52 22 C56 12, 64 14, 64 18"
            stroke="url(#logo-grad-secondary)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )}

      {variant === 'sun' && (
        <>
          {/* Sun Core */}
          <circle cx="50" cy="50" r="18" fill="url(#logo-grad-primary)" />
          <circle cx="50" cy="50" r="18" fill="url(#logo-grad-secondary)" opacity="0.25" />
          
          {/* Sun Rays (Rotated) */}
          <g stroke="url(#logo-grad-secondary)" strokeWidth="4.5" strokeLinecap="round">
            <line x1="50" y1="12" x2="50" y2="22" />
            <line x1="50" y1="88" x2="50" y2="78" />
            <line x1="12" y1="50" x2="22" y2="50" />
            <line x1="88" y1="50" x2="78" y2="50" />
            
            <line x1="23.2" y1="23.2" x2="30.3" y2="30.3" />
            <line x1="76.8" y1="76.8" x2="69.7" y2="69.7" />
            <line x1="76.8" y1="23.2" x2="69.7" y2="30.3" />
            <line x1="23.2" y1="76.8" x2="30.3" y2="69.7" />
          </g>
        </>
      )}
    </svg>
  );
}
