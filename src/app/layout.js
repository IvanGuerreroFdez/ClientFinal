// /src/app/layout.js
'use client';

import { usePathname } from 'next/navigation';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import './styles/global.css';  // Importamos el archivo CSS

export default function RootLayout({ children }) {
  const pathname = usePathname();  // Obtiene la ruta actual

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
