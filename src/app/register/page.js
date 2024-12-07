'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import Cookie from 'js-cookie';
import '../styles/register.css';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Error al registrar el usuario.');
        return;
      }

      const data = await response.json();
      Cookie.set('authToken', data.token, { expires: 7 });
      router.push('/verification');
    } catch (error) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="register-container">
        <h2>Regístrate</h2>
        <form className="register-form" onSubmit={handleRegister}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              required
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar contraseña"
              required
            />

            {error && <p>{error}</p>}

            <button type="submit">Registrar</button>
        </form>

        <div>
            <p>
              Si tienes cuenta:{' '}
              <a onClick={() => router.push('/login')}>Inicia sesión</a>
            </p>
        </div>
    </div>
  );
}
