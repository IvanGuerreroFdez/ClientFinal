'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookie from 'js-cookie';
import '../styles/verification.css';

export default function ConfirmPage() {
  const [confirmationCode, setConfirmationCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleInputChange = (e, index) => {
    const value = e.target.value;

    if (value.match(/[^0-9]/)) return;

    const newCode = [...confirmationCode];
    newCode[index] = value;
    setConfirmationCode(newCode);

    if (value && index < 5) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();

    if (confirmationCode.includes('')) {
      setError('Ingrese el codigo de confirmación');
      return;
    }

    const code = confirmationCode.join('');

    const token = Cookie.get('authToken');

    if (!token) {
      setError('Error al autenticar');
      return;
    }

    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/validation', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.error === 'Invalid confirmation code.') {
          setError('El código de confirmación es inválido');
        } else {
          setError('Error al confirmar el correo');
        }
        return;
      }

      const data = await response.json();
      if (data.acknowledged && data.modifiedCount > 0) {
        setSuccessMessage('Correo confirmado exitosamente. Ahora puedes iniciar sesión.');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError('Error al confirmar el correo.');
      }
    } catch (error) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="verification-container">
      <h2>Confirmación de correo</h2>
      <form className="verification-form" onSubmit={handleConfirm}>
        <div>
          <label>Código de confirmación</label>
          <div>
            {confirmationCode.map((digit, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                type="text"
                className="verification-input"
                value={digit}
                onChange={(e) => handleInputChange(e, index)}
                maxLength="1"
              />
            ))}
          </div>
        </div>

        {error && <p className="verification-error">{error}</p>}
        <p></p>
        {successMessage && <p className="verification-success">{successMessage}</p>}

        <button type="submit" className="verification-button">Confirmar</button>
      </form>
    </div>
  );
}
