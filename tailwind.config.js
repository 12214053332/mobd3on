/** Tailwind config — design tokens come from the prototype's :root variables (assets/css/tailwind.src.css).
 *  Shared by the CLI build (module.exports) and by the Play CDN in the browser (tailwind.config). */
const config = {
  content: ['./admin/**/*.html', './components/**/*.html', './assets/js/**/*.js'],
  corePlugins: { preflight: false }, // the project's own reset lives in tailwind.src.css (@layer base)
  theme: {
    // responsive breakpoints used by the prototype: "u" = from this width up, "d" = down to this width
    screens: {
      u1025: { min: '1025px' },
      d1200: { max: '1200px' },
      d1100: { max: '1100px' },
      d1024: { max: '1024px' },
      d820: { max: '820px' },
      d768: { max: '768px' },
      d560: { max: '560px' },
      d480: { max: '480px' }
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#fff',
      primary: {
        900: 'var(--primary-900)', 800: 'var(--primary-800)', 700: 'var(--primary-700)', 600: 'var(--primary-600)',
        500: 'var(--primary-500)', 100: 'var(--primary-100)', 50: 'var(--primary-50)'
      },
      gold: { 600: 'var(--gold-600)', 500: 'var(--gold-500)', 100: 'var(--gold-100)', 50: 'var(--gold-50)' },
      blue: { 500: 'var(--blue-500)' },
      canvas: 'var(--bg-primary)',
      surface: { DEFAULT: 'var(--surface)', hover: 'var(--surface-hover)', selected: 'var(--surface-selected)' },
      guide: 'var(--border-guide)',
      edge: { DEFAULT: 'var(--border-default)', strong: 'var(--border-strong)' },
      ink: { DEFAULT: 'var(--text-primary)', 2: 'var(--text-secondary)', 3: 'var(--text-tertiary)' },
      success: { 700: 'var(--success-700)', bg: 'var(--success-bg)' },
      warning: { 700: 'var(--warning-700)', bg: 'var(--warning-bg)' },
      error: { 700: 'var(--error-700)', bg: 'var(--error-bg)' },
      info: { 700: 'var(--info-700)', bg: 'var(--info-bg)' }
    },
    borderRadius: { none: '0', sm: 'var(--r-sm)', md: 'var(--r-md)', lg: 'var(--r-lg)', xl: 'var(--r-xl)', full: 'var(--r-full)' },
    boxShadow: { none: 'none', card: 'var(--shadow-card)', md: 'var(--shadow-md)', lg: 'var(--shadow-lg)' },
    backgroundImage: {
      'select-caret': `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235F6F6A' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`
    },
    fontFamily: { sans: ["'Tajawal'", 'system-ui', 'sans-serif'] },
    extend: {}
  },
  plugins: []
};

if (typeof module !== 'undefined') module.exports = config;
else if (typeof tailwind !== 'undefined') tailwind.config = config;
