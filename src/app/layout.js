'use client';

import Footer from './components/Footer';
import Navbar from './components/Navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar /> 
        <div style={{ marginTop: '60px' }}>
          <main style={{ padding: '16px' }}>
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
