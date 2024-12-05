'use client';

import { useRouter } from 'next/navigation';
import Cookie from 'js-cookie';

export default function HomePage() {
  const router = useRouter();

  const handleLogout = () => {
    Cookie.remove('authToken');  // Elimina el token de la cookie
    router.push('/login');  // Redirige al login
  };

  return (
    <div className="welcome-container">
      <h2 className="text-center">¡Bienvenido al proyecto Final!</h2>
      <div className="text-center">
        <button onClick={handleLogout} className="logout-btn"> Cerrar sesión</button>
      </div>
    </div>
  );
}
