'use client';

import { useRouter } from 'next/navigation';
import Cookie from 'js-cookie';
import './styles/global.css';

export default function HomePage() {
  const router = useRouter();

  const handleLogout = () => {
    Cookie.remove('authToken');
    router.push('/login');
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
