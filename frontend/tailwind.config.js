 /** @type {import('tailwindcss').Config} */
export default {
   content: ["./src/**/*.{html,js}"],
   theme: {
     extend: {animation: {
  fadeIn: 'fadeIn 0.4s ease-in forwards',
},
keyframes: {
  fadeIn: {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
},
}
     ,
   },
   plugins: [],
 }