
// pages/_app.js

import { AuthProvider } from '../context/authcontext';
import Navbar from '../components/Navbar';  // Import the Navbar component
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Navbar />  {/* Add Navbar here */}
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;

