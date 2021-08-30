// const baseColors = {
//   brandPrimary: 'var(--color-brand-primary)',
//   brandPrimaryHover: 'var(--color-brand-primary-hover)',
//   brandSecondary: 'var(--color-brand-secondary)',
//   brandSecondaryHover: 'var(--color-brand-secondary-hover)',
//   success: 'var(--color-success)',
//   error: 'var(--color-error)',
//   failure: 'var(--color-failure)',
//   failureHover: 'var(--color-failure-hover)',
//   warning: 'var(--color-warning)',
//   increase: 'var(--color-increase)',
//   decrease: 'var(--color-decrease)',
//   white: 'var(--color-white)',
//   black: 'var(--color-black)',
//   gray: 'var(--color-gray)',
//   lightgray: 'var(--color-lightgray)',
//   transparent: 'transparent'
// };

// module.exports = {
//   purge: {
//     enabled: true,
//     preserveHtmlElements: false,
//     content: ['./pages/**/*.tsx', './src/**/*.tsx'],
//     options: {
//       safelist: ['dark']
//     }
//   },
//   darkMode: 'class', // or 'media' or 'class'
//   theme: {
//     colors: false,
//     screens: {
//       sm: '640px',
//       md: '768px',
//       lg: '1024px',
//       xl: '1280px',
//       '2xl': '1536px'
//     },
//     textColor: {
//       ...baseColors,
//       default: 'var(--color-text-default)',
//       secondary: 'var(--color-text-secondary)',
//       tertiary: 'var(--color-text-tertiary)',
//       disabled: 'var(--color-text-disabled)',
//       input: 'var(--color-text-input)',
//       inputSecondary: 'var(--color-text-input-secondary)'
//     },
//     backgroundColor: {
//       ...baseColors,
//       disabled: 'var(--color-bg-disabled)',
//       input: 'var(--color-bg-input)',
//       default: 'var(--color-bg-default)',
//       secondary: 'var(--color-bg-secondary)',
//       tertiary: 'var(--color-bg-tertiary)',
//       // Extra
//       header: 'var(--color-bg-header)',
//       scaffold: 'var(--color-bg-scaffold)',
//       overlay: 'var(--color-bg-overlay)'
//     },
//     borderColor: {
//       ...baseColors,
//       default: 'var(--color-border-default)',
//       secondary: 'var(--color-border-secondary)',
//       grey: 'var(--color-border-grey)'
//     },
//     fontFamily: {
//       sans: ['Manrope', 'Roboto'],
//       mono: [
//         'ui-monospace',
//         'SFMono-Regular',
//         'Menlo',
//         'Monaco',
//         'Consolas',
//         'Liberation Mono',
//         'Courier New',
//         'monospace'
//       ]
//     },
//     fontSize: {
//       xs: ['12px', '12px'],
//       sm: ['14px', '14px'],
//       base: ['16px', '16px'],
//       md: ['18px', '18px'],
//       mdx: ['20px', '20px'],
//       lg: ['24px', '24px'],
//       xl: ['36px', '36px'],
//       xxl: ['40px', '40px']
//     },
//     maxWidth: {
//       none: 'none',
//       0: '0rem',
//       xs: '20rem',
//       sm: '24rem',
//       md: '28rem',
//       lg: '32rem',
//       xl: '36rem',
//       '2xl': '42rem',
//       '3xl': '48rem',
//       '4xl': '1080px',
//       '5xl': '64rem',
//       '6xl': '72rem',
//       '7xl': '80rem',
//       full: '100%',
//       min: 'min-content',
//       max: 'max-content',
//       prose: '65ch'
//     },
//     minWidth: {
//       symbol: '2.5em',
//       more: '130px'
//     },
//     extend: {
//       width: {
//         card: '480px'
//       },
//       minHeight: {
//         '70vh': '70vh'
//       },
//       maxHeight: {
//         90: '21rem'
//       }
//     }
//   },
//   variants: {
//     extend: { boxShadow: ['active'] }
//   },
//   plugins: []
// };


module.exports = {
  mode: 'jit',
  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  darkMode: false,
  theme: {
    fontFamily: {
      display: ['PT Mono, monospace'],
      body: ['Lato, sans-serif'],
    },
    extend: {
      backgroundImage: (_) => ({
        'feature-one': "url('../../public/img/feature1.png')",
        'feature-two': "url('../../public/img/feature2.png')",
        'feature-three': "url('../../public/img/feature3.png')",
        'feature-four': "url('../../public/img/feature4.png')",
        'bg-texture': "url('../../public/img/bgtexture.png')",
        'risk-one': "url('../../public/img/risk1.png')",
        'risk-two': "url('../../public/img/risk2.png')",
        'risk-three': "url('../../public/img/risk3.png')",
        'risk-four': "url('../../public/img/risk4.png')",
        'redeem-one': "url('../../public/img/redeem1.png')",
        'redeem-two': "url('../../public/img/redeem2.png')",
        'redeem-three': "url('../../public/img/redeem3.png')",
        'redeem-four': "url('../../public/img/redeem4.png')",
      }),
      height: {
        350: '350px',
        550: '550px',
        650: '650px',
        750: '750px',
      },
      cursor: {
        help: 'help',
      },
      colors: {
        primary: { light: '#F2C94C', dark: '#EEB91B' },
        'secondary-1': { light: '#AFD803', dark: '#6CBF00' },
        'secondary-2': { light: '#E54033', dark: '#C7251A' },
        'secondary-3': { light: '#026DF7', dark: '#0259CA' },
        'secondary-4': { light: '#262145', dark: '#1B1735' },
        'bkg-1': '#141125',
        'bkg-2': '#242132',
        'bkg-3': '#393549',
        'bkg-4': '#4F4B63',
        'fgd-1': '#F0EDFF',
        'fgd-2': '#FCFCFF',
        'fgd-3': '#B9B5CE',
        'fgd-4': '#706C81',
        'mango-yellow': '#F2C94C',
        'mango-red': '#E54033',
        'mango-green': '#AFD803',
        'mango-dark': {
          lighter: '#332F46',
          light: '#262337',
          DEFAULT: '#141026',
        },
        'mango-med': {
          light: '#C2BDD9',
          DEFAULT: '#9490A6',
          dark: '#706C81',
        },
        'mango-light': {
          light: '#FCFCFF',
          DEFAULT: '#F0EDFF',
          dark: '#B9B5CE',
        },
        'mango-grey': {
          lighter: '#f7f7f7',
          light: '#e6e6e6',
          dark: '#092e34',
          darker: '#072428',
          darkest: '#061f23',
        },
      },
      animation: {
        'connect-wallet-ping':
          'connect-wallet-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        gradient: 'gradient 4s ease-in-out infinite',
      },
      keyframes: {
        'connect-wallet-ping': {
          '75%, 100%': {
            transform: 'scale(1.06, 1.3)',
            opacity: '10%',
          },
        },
        gradient: {
          '0%': {
            'background-position': '15% 0%',
          },
          '50%': {
            'background-position': '85% 100%',
          },
          '100%': {
            'background-position': '15% 0%',
          },
        },
      },
      strokeWidth: {
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7',
      },
    },
  },
  variants: {
    extend: {
      cursor: ['hover', 'focus', 'disabled'],
      opacity: ['disabled'],
      backgroundColor: ['disabled'],
      textColor: ['disabled'],
    },
  },
  plugins: [],
}
