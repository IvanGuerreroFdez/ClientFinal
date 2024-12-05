'use client';  // Asegura que este componente se ejecute en el cliente

import { usePathname } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Barralateral from '../components/Barralateral';
import '../styles/tailwind.css';  // Asegúrate de que el archivo CSS esté importado correctamente

export default function RootLayout({ children }) {
  const pathname = usePathname();  // Obtiene la ruta actual

  // Definir rutas donde no mostramos el sidebar
  const noSidebarRoutes = ['/', '/login', '/register', '/confirmacion'];  

  // Determina si debe mostrar el sidebar (si la ruta no está en las rutas excepcionales)
  const showSidebar = !noSidebarRoutes.includes(pathname);

  return (
    <html lang="es">
      <body className="font-sans bg-background flex flex-col min-h-screen">
        {/* Siempre mostramos el Header */}
        <Header />

        <div className="flex flex-1">
          {/* Mostrar la barra lateral solo si la ruta no está en las excepciones */}
          {showSidebar && <Barralateral />}

          {/* El contenido principal */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>

        {/* Siempre mostramos el Footer */}
        <Footer />
      </body>
    </html>
  );
}
