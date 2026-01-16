// pages/_app.js
import '../styles/global.css'; // Import global styles
import Navbar from '../components/Navbar';
import { SupabaseAuthProvider } from '../lib/SupabaseAuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <SupabaseAuthProvider>
      <Navbar />
      <div className="container">
        <Component {...pageProps} />
      </div>
    </SupabaseAuthProvider>
  );
}

export default MyApp;