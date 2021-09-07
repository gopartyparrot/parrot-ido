const baseColors = {
  brandPrimary: 'var(--color-brand-primary)',
  brandPrimaryHover: 'var(--color-brand-primary-hover)',
  brandSecondary: 'var(--color-brand-secondary)',
  brandSecondaryHover: 'var(--color-brand-secondary-hover)',
  success: 'var(--color-success)',
  error: 'var(--color-error)',
  failure: 'var(--color-failure)',
  failureHover: 'var(--color-failure-hover)',
  warning: 'var(--color-warning)',
  increase: 'var(--color-increase)',
  decrease: 'var(--color-decrease)',
  white: 'var(--color-white)',
  black: 'var(--color-black)',
  gray: 'var(--color-gray)',
  lightgray: 'var(--color-lightgray)',
  transparent: 'transparent',
}

module.exports = {
  purge: {
    enabled: true,
    preserveHtmlElements: false,
    content: ['./src/**/*.tsx'],
    options: {
      safelist: ['dark', 'scale'],
    },
  },
  darkMode: 'class',
  theme: {
    colors: false,
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    textColor: {
      ...baseColors,
      default: 'var(--color-text-default)',
      secondary: 'var(--color-text-secondary)',
      tertiary: 'var(--color-text-tertiary)',
      disabled: 'var(--color-text-disabled)',
      input: 'var(--color-text-input)',
      inputSecondary: 'var(--color-text-input-secondary)',
    },
    backgroundColor: {
      ...baseColors,
      disabled: 'var(--color-bg-disabled)',
      input: 'var(--color-bg-input)',
      default: 'var(--color-bg-default)',
      secondary: 'var(--color-bg-secondary)',
      tertiary: 'var(--color-bg-tertiary)',
      // Extra
      header: 'var(--color-bg-header)',
      scaffold: 'var(--color-bg-scaffold)',
      overlay: 'var(--color-bg-overlay)',
    },
    borderColor: {
      ...baseColors,
      default: 'var(--color-border-default)',
      secondary: 'var(--color-border-secondary)',
      gray: 'var(--color-border-gray)',
    },
    fontFamily: {
      sans: ['Manrope', 'Roboto'],
      mono: ['ui-monospace', 'monospace'],
    },
    fontSize: {
      xxs: ['10px', '10px'],
      xs: ['12px', '12px'],
      sm: ['14px', '14px'],
      base: ['16px', '16px'],
      md: ['18px', '18px'],
      mdx: ['20px', '20px'],
      lg: ['24px', '24px'],
      xl: ['36px', '36px'],
      xxl: ['40px', '40px'],
    },
    extend: {
      minWidth: {
        rpc: '220px',
      },
      maxWidth: {
        '4xl': '1080px',
        card: '496px',
        tooltip: '305px',
      },
      minHeight: {
        '70vh': '70vh',
      },
      maxHeight: {
        90: '21rem',
      },
      blur: {
        xs: 'blur(3px)',
      },
      shadow: {
        card: '0px 2px 2px rgba(0, 0, 0, 0.16)',
      },
    },
  },
  variants: {
    extend: { boxShadow: ['active'], display: ['dark'] },
  },
  plugins: [],
}
