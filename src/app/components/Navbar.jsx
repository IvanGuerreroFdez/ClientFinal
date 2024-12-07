'use client';

import { useRouter } from 'next/navigation';
import Cookie from 'js-cookie';
import "../styles/global.css";

export default function Navbar() {
  const router = useRouter();
  const token = Cookie.get('authToken');

  const handleRedirect = (path) => {
    if (!token && path !== '/login') {
      router.push('/login'); 
    } else {
      router.push(path);
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
