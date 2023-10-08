/** @type {import('tailwindcss').Config} */
export default {
  content: [
    
    // "./src/**/*.{html,js}",
  "./src/**/*.{html,js,vue,js,ts,jsx,tsx}",
  "./node_modules/flowbite/**/*.js"

],
  theme: {
    extend: {},
  }, 
  plugins: [
    require('flowbite/plugin')
]
}

