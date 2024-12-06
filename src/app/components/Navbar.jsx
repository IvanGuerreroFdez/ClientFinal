// /components/Navbar.jsx
'use client';

import { useRouter } from 'next/navigation';
import Cookie from 'js-cookie';

export default function Navbar() {
  const router = useRouter();
  const token = Cookie.get('authToken');  // Obtenemos el token de las cookies

  // Función para redirigir si no hay token
  const handleRedirect = (path) => {
    if (!token && path !== '/login') {
      router.push('/login');  // Si no hay token, redirige a login
    } else {
      router.push(path);  // Si hay token, redirige a la ruta deseada
    }
  };

  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li><a onClick={() => handleRedirect('/')}>HomePage</a></li>
        <li><a onClick={() => handleRedirect('/login')}>Cuenta</a></li>
        <li><a onClick={() => handleRedirect('/clientes')}>Clientes</a></li>
        <li><a onClick={() => handleRedirect('/proyectos')}>Proyectos</a></li>
        <li><a onClick={() => handleRedirect('/albaranes')}>Albaranes</a></li>
      </ul>
    </nav>
  );
}
