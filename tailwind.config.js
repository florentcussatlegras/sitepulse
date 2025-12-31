// tailwind.config.js
export default {
  darkMode: ['class'], // ✅ dark activé uniquement avec class="dark"
  content: [
    './templates/**/*.html.twig',       // tous les templates Twig
    './assets/react/**/*.{js,ts,jsx,tsx}', // tous les fichiers React/TSX
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
