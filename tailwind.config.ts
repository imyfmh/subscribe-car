import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#152132',
        mist: '#f7efe2',
        sand: '#efe2cf',
        peach: '#ff9565',
        lagoon: '#2c7567',
        gold: '#f2bc4b',
      },
      boxShadow: {
        float: '0 24px 64px rgba(21, 33, 50, 0.12)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Avenir Next"', '"PingFang SC"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
      backgroundImage: {
        aura:
          'radial-gradient(circle at top left, rgba(255,149,101,0.24), transparent 40%), radial-gradient(circle at top right, rgba(44,117,103,0.18), transparent 30%), linear-gradient(180deg, #fcfaf6 0%, #f7efe2 100%)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 600ms ease-out forwards',
      },
    },
  },
  plugins: [],
} satisfies Config;
