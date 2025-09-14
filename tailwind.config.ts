import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark base colors
        dark: {
          950: '#0a0a0b',
          900: '#1a1a1b',
          800: '#2a2a2b',
          700: '#3a3a3b',
          600: '#4a4a4b',
          500: '#5a5a5b',
          400: '#6a6a6b',
          300: '#7a7a7b',
          200: '#8a8a8b',
          100: '#9a9a9b',
          50: '#aaaaab',
        },
        // Neon color palette - exact specifications
        neon: {
          pink: '#FF2BD7',      // Pink
          blue: '#00E5FF',      // Blue ray
          red: '#FF2A2A',       // Red ray
          yellow: '#FAFF00',    // Neo Yellow
          green: '#39FF14',     // Neo Green
          gold: '#FFC400',      // Neo Gold
          purple: '#8B5CF6',    // Additional purple
          cyan: '#06B6D4',      // Additional cyan
          orange: '#FF6B35',    // Additional orange
        },
        // Legacy cosmic colors for compatibility
        cosmic: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
          purple: '#8B5CF6',
          blue: '#3B82F6',
          cyan: '#06B6D4',
        },
        primary: {
          DEFAULT: '#FF2BD7',
          dark: '#E01FB8',
          light: '#FF5CE0',
        },
        secondary: {
          DEFAULT: '#00E5FF',
          dark: '#00C4E6',
          light: '#33EBFF',
        },
        accent: {
          DEFAULT: '#39FF14',
          dark: '#2EE60F',
          light: '#5AFF3D',
        },
      },
      backgroundImage: {
        // Neon gradients with exact colors
        'neon-gradient': 'linear-gradient(135deg, #FF2BD7, #00E5FF, #39FF14)',
        'neon-pink-blue': 'linear-gradient(135deg, #FF2BD7, #00E5FF)',
        'neon-blue-green': 'linear-gradient(135deg, #00E5FF, #39FF14)',
        'neon-yellow-red': 'linear-gradient(135deg, #FAFF00, #FF2A2A)',
        'neon-gold-pink': 'linear-gradient(135deg, #FFC400, #FF2BD7)',
        'neon-rainbow': 'linear-gradient(135deg, #FF2BD7, #00E5FF, #FAFF00, #39FF14, #FFC400)',
        'cosmic-gradient': 'radial-gradient(ellipse at center, rgba(255, 43, 215, 0.1) 0%, rgba(0, 229, 255, 0.05) 50%, rgba(10, 10, 11, 1) 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'dark-gradient': 'linear-gradient(135deg, #0a0a0b 0%, #1a1a1b 25%, #2a2a2b 50%, #1a1a1b 75%, #0a0a0b 100%)',
      },
      fontFamily: {
        'inter': ['var(--font-inter)', 'sans-serif'],
        'noto-naskh-arabic': ['var(--font-noto-naskh-arabic)', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Noto Naskh Arabic', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out',
        'fade-in-delayed': 'fadeIn 1s ease-out 0.2s both',
        'fade-in-delayed-2': 'fadeIn 1s ease-out 0.4s both',
        'fade-in-delayed-3': 'fadeIn 1s ease-out 0.6s both',
        'fade-in-delayed-4': 'fadeIn 1s ease-out 0.8s both',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-down': 'slideDown 0.8s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 2s',
        'float-slow': 'float 8s ease-in-out infinite 1s',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)' },
        },
        pulseGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(255, 43, 215, 0.5), 0 0 40px rgba(0, 229, 255, 0.3)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(255, 43, 215, 0.8), 0 0 80px rgba(0, 229, 255, 0.6)',
            transform: 'scale(1.05)'
          },
        },
        pulseNeon: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(255, 43, 215, 0.6)',
            filter: 'brightness(1)'
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(255, 43, 215, 1), 0 0 60px rgba(0, 229, 255, 0.8)',
            filter: 'brightness(1.2)'
          },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255, 43, 215, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 229, 255, 0.8)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      boxShadow: {
        // Neon shadows with exact colors
        'neon': '0 0 20px rgba(255, 43, 215, 0.5), 0 0 40px rgba(0, 229, 255, 0.3)',
        'neon-pink': '0 0 20px rgba(255, 43, 215, 0.6)',
        'neon-blue': '0 0 20px rgba(0, 229, 255, 0.6)',
        'neon-green': '0 0 20px rgba(57, 255, 20, 0.6)',
        'neon-yellow': '0 0 20px rgba(250, 255, 0, 0.6)',
        'neon-red': '0 0 20px rgba(255, 42, 42, 0.6)',
        'neon-gold': '0 0 20px rgba(255, 196, 0, 0.6)',
        'neon-lg': '0 0 40px rgba(255, 43, 215, 0.8)',
        'glass': '0 8px 32px rgba(255, 255, 255, 0.1)',
        'glass-lg': '0 25px 50px -12px rgba(31, 38, 135, 0.25)',
        'cosmic': '0 0 30px rgba(139, 92, 246, 0.3)',
        'cosmic-cyan': '0 0 30px rgba(6, 182, 212, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};

export default config;

