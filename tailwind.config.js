/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'on-background': '#191c1d',
        'outline-variant': '#c5c6cd',
        'surface-container': '#edeeef',
        'on-tertiary': '#ffffff',
        'secondary-container': '#d1e1fa',
        'on-secondary-container': '#556479',
        'primary-fixed-dim': '#abcae8',
        'tertiary-fixed': '#f9dfb8',
        'error-container': '#ffdad6',
        'surface-tint': '#43617c',
        'tertiary-fixed-dim': '#dcc39d',
        'surface-variant': '#e1e3e4',
        'surface-container-high': '#e7e8e9',
        'tertiary': '#4b3b1f',
        'on-secondary-fixed-variant': '#39485c',
        'secondary-fixed': '#d4e4fc',
        'tertiary-container': '#645234',
        'primary': '#214059',
        'surface-container-low': '#f3f4f5',
        'background': '#f8f9fa',
        'on-tertiary-fixed-variant': '#554427',
        'on-primary-container': '#aecdeb',
        'secondary': '#515f74',
        'surface-container-lowest': '#ffffff',
        'surface-dim': '#d9dadb',
        'on-error': '#ffffff',
        'on-primary-fixed-variant': '#2b4963',
        'surface': '#f8f9fa',
        'surface-bright': '#f8f9fa',
        'on-tertiary-fixed': '#261902',
        'surface-container-highest': '#e1e3e4',
        'outline': '#75777d',
        'secondary-fixed-dim': '#b8c8e0',
        'on-primary': '#ffffff',
        'on-error-container': '#93000a',
        'primary-fixed': '#cce5ff',
        'on-surface': '#191c1d',
        'error': '#ba1a1a',
        'on-surface-variant': '#44474c',
        'on-tertiary-container': '#dfc6a0',
        'on-primary-fixed': '#001d31',
        'on-secondary-fixed': '#0d1c2e',
        'on-secondary': '#ffffff',
        'inverse-primary': '#abcae8',
        'primary-container': '#395771',
        'inverse-surface': '#2e3132',
        'inverse-on-surface': '#f0f1f2'
      },
      fontFamily: {
        'headline': ['Manrope'],
        'body': ['Inter'],
        'label': ['Inter']
      },
      borderRadius: {
        'DEFAULT': '1rem',
        'lg': '2rem',
        'xl': '3rem',
        'full': '9999px'
      },
      backdropBlur: {
        'DEFAULT': '20px'
      }
    },
  },
  plugins: [],
}
