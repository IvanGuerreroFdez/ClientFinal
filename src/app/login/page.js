'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookie from 'js-cookie';
import '../styles/login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); 

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/login', {  
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

      Cookie.set('authToken', data.token, { expires: 7 });
      console.log('Token guardado en cookies:', Cookie.get('authToken'));

      router.push('/');
    } catch (error) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="login-container">
        <h2>Iniciar sesión</h2>
        <form className="login-form" onSubmit={handleLogin}>
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
                <a onClick={() => router.push('/register')}>Regístrate aquí</a>
            </p>
        </div>
    </div>
  );
}
