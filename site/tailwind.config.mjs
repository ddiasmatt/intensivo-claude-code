/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', 'class'],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
  	container: {
  		center: true,
  		padding: {
  			DEFAULT: '1rem',
  			sm: '1.5rem',
  			lg: '2rem'
  		},
  		screens: {
  			'2xl': '1280px'
  		}
  	},
  	extend: {
  		fontFamily: {
  			sans: [
  				'Inter',
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif'
  			],
  			serif: [
  				'Georgia',
  				'ui-serif',
  				'serif'
  			],
  			mono: [
  				'JetBrains Mono',
  				'ui-monospace',
  				'SFMono-Regular',
  				'monospace'
  			]
  		},
  		colors: {
  			page: '#0A0A0B',
  			surface: '#141416',
  			elevated: '#1C1C20',
  			accent: {
  				DEFAULT: '#E07A3A',
  				hover: '#F59E53',
  				deep: '#C85D25'
  			},
  			ink: {
  				primary: '#F5F5F5',
  				secondary: '#A8A8A8',
  				muted: '#6B6B6B'
  			}
  		},
  		keyframes: {
  			'live-pulse': {
  				'0%, 100%': {
  					opacity: '1'
  				},
  				'50%': {
  					opacity: '0.4'
  				}
  			},
  			'live-ring': {
  				'0%': {
  					transform: 'scale(1)',
  					opacity: '0.6'
  				},
  				'100%': {
  					transform: 'scale(2.4)',
  					opacity: '0'
  				}
  			},
  			'glow-pulse': {
  				'0%, 100%': {
  					opacity: '0.55',
  					transform: 'scale(1)'
  				},
  				'50%': {
  					opacity: '0.85',
  					transform: 'scale(1.03)'
  				}
  			},
  			'cta-shimmer': {
  				'0%': {
  					transform: 'translateX(-120%) skewX(-12deg)'
  				},
  				'100%': {
  					transform: 'translateX(420%) skewX(-12deg)'
  				}
  			},
  			'fade-in': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(8px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'marquee-left': {
  				'0%': {
  					transform: 'translateX(0)'
  				},
  				'100%': {
  					transform: 'translateX(-50%)'
  				}
  			},
  			'marquee-right': {
  				'0%': {
  					transform: 'translateX(-50%)'
  				},
  				'100%': {
  					transform: 'translateX(0)'
  				}
  			},
  			'spotlight-orbit': {
  				'0%, 100%': {
  					transform: 'translate(0, 0)'
  				},
  				'33%': {
  					transform: 'translate(40px, -30px)'
  				},
  				'66%': {
  					transform: 'translate(-30px, 40px)'
  				}
  			},
  			sparkle: {
  				'0%, 100%': {
  					opacity: '0',
  					transform: 'scale(0)'
  				},
  				'50%': {
  					opacity: '1',
  					transform: 'scale(1)'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			marquee: {
  				from: {
  					transform: 'translateX(0)'
  				},
  				to: {
  					transform: 'translateX(calc(-100% - var(--gap)))'
  				}
  			},
  			'marquee-vertical': {
  				from: {
  					transform: 'translateY(0)'
  				},
  				to: {
  					transform: 'translateY(calc(-100% - var(--gap)))'
  				}
  			}
  		},
  		animation: {
  			'live-pulse': 'live-pulse 1.6s ease-in-out infinite',
  			'live-ring': 'live-ring 1.8s ease-out infinite',
  			'glow-pulse': 'glow-pulse 2.6s ease-in-out infinite',
  			'cta-shimmer': 'cta-shimmer 4s ease-in-out 1.2s infinite',
  			'fade-in': 'fade-in 0.6s ease-out both',
  			'marquee-left': 'marquee-left 45s linear infinite',
  			'marquee-right': 'marquee-right 45s linear infinite',
  			'spotlight-orbit': 'spotlight-orbit 18s ease-in-out infinite',
  			sparkle: 'sparkle 1.8s ease-in-out infinite',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			marquee: 'marquee var(--duration) linear infinite',
  			'marquee-vertical': 'marquee-vertical var(--duration) linear infinite'
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')],
};
