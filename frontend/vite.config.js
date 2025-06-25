import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
<<<<<<< HEAD
// export default defineConfig({
//   server: {
//     proxy: {
//       "/api": "http://localhost:5000", // Your backend URL
//       "/uploads": "http://localhost:5000", // For static files
//     },
//   },
//   plugins: [react()],
// });
=======
>>>>>>> 0cca3db4d70e4b7559b5429ce182a00babd1f8d2
