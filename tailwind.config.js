/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				// Cyberpunk palette
				midnight: '#0a0a1a',
				'midnight-light': '#12122a',
				magenta: {
					DEFAULT: '#ff00cc',
					light: '#ff3399',
					glow: 'rgba(255, 0, 204, 0.4)',
				},
				cyan: {
					DEFAULT: '#00f2ff',
					light: '#00ccff',
					glow: 'rgba(0, 242, 255, 0.4)',
				},
				violet: {
					DEFAULT: '#8b5cf6',
					glow: 'rgba(139, 92, 246, 0.4)',
				},
				// Base colors
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: '#0a0a1a',
				foreground: '#ffffff',
				primary: {
					DEFAULT: '#ff00cc',
					foreground: '#ffffff',
				},
				secondary: {
					DEFAULT: '#00f2ff',
					foreground: '#0a0a1a',
				},
				accent: {
					DEFAULT: '#8b5cf6',
					foreground: '#ffffff',
				},
				muted: {
					DEFAULT: '#1e1e3f',
					foreground: '#a0a0c0',
				},
				card: {
					DEFAULT: 'rgba(15, 15, 40, 0.8)',
					foreground: '#ffffff',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			boxShadow: {
				'glow-magenta': '0 0 20px rgba(255, 0, 204, 0.4), 0 0 40px rgba(255, 0, 204, 0.2)',
				'glow-cyan': '0 0 20px rgba(0, 242, 255, 0.4), 0 0 40px rgba(0, 242, 255, 0.2)',
				'glow-violet': '0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)',
				'neon-magenta': '0 0 5px #ff00cc, 0 0 10px #ff00cc, 0 0 20px #ff00cc',
				'neon-cyan': '0 0 5px #00f2ff, 0 0 10px #00f2ff, 0 0 20px #00f2ff',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'glow-pulse': {
					'0%, 100%': { opacity: 1 },
					'50%': { opacity: 0.5 },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'shimmer': 'shimmer 3s ease-in-out infinite',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'cyberpunk-gradient': 'linear-gradient(135deg, #ff00cc 0%, #8b5cf6 50%, #00f2ff 100%)',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
