/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // New Professional Color Palette
        sky_blue: '#8ecae6',
        blue_green: '#219ebc',
        prussian_blue: '#023047',
        selective_yellow: '#ffb703',
        ut_orange: '#fb8500',
        
        // Extended variations for better design flexibility
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#8ecae6',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        ocean: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#219ebc',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        navy: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#023047',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#ffb703',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb8500',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        }
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #8ecae6 0%, #219ebc 25%, #023047 75%, #ffb703 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(142, 202, 230, 0.1) 0%, rgba(33, 158, 188, 0.1) 100%)',
        'button-primary': 'linear-gradient(135deg, #ffb703, #fb8500)',
        'button-secondary': 'linear-gradient(135deg, #219ebc, #023047)',
        'glass-gradient': 'linear-gradient(135deg, rgba(142, 202, 230, 0.05) 0%, rgba(33, 158, 188, 0.05) 100%)',
      },
      boxShadow: {
        'ocean': '0 4px 20px rgba(33, 158, 188, 0.15), 0 1px 3px rgba(2, 48, 71, 0.2)',
        'ocean-lg': '0 10px 40px rgba(33, 158, 188, 0.2), 0 4px 12px rgba(2, 48, 71, 0.25)',
        'ocean-xl': '0 20px 60px rgba(33, 158, 188, 0.25), 0 8px 20px rgba(2, 48, 71, 0.3)',
        'glow-amber': '0 0 30px rgba(255, 183, 3, 0.4)',
        'glow-orange': '0 0 40px rgba(251, 133, 0, 0.6)',
      },
      animation: {
        'gradient-shift': 'gradient-shift 6s ease infinite',
        'float-gentle': 'float-gentle 4s ease-in-out infinite',
        'pulse-ocean': 'pulse-ocean 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};