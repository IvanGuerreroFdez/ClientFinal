'use client'; // Asegura que este componente se ejecute en el cliente

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Usamos router para redirigir al usuario
import Cookie from 'js-cookie';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // Usamos router para redirigir al usuario después de login

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/login', {  // URL de la API de login
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Error al iniciar sesión.');
        console.log('Error al iniciar sesión:', data);
        return;
      }

      const data = await response.json();
      console.log('Login exitoso:', data);

      // Guardar token de autenticación en cookies con expiración de una semana
      Cookie.set('authToken', data.token, { expires: 7 });
      console.log('Token guardado en cookies:', Cookie.get('authToken'));

      // Redirigir al usuario a la página principal o dashboard
      router.push('/');
    } catch (error) {
      setError('Hubo un problema al comunicarse con el servidor. Intenta nuevamente.');
    }
  };

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit">Iniciar sesión</button>
      </form>

      <div>
        <p>Crear una nueva cuenta!{' '}
          <a onClick={() => router.push('/register')} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}
