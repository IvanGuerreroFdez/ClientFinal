// /src/app/clientes/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookie from 'js-cookie';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = Cookie.get('authToken');  // Obtener el token de las cookies
    if (!token) {
      router.push('/login');  // Si no hay token, redirigir a login
      return;
    }

    const fetchClients = async () => {
      try {
        const response = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('No se pudieron cargar los clientes');
        }

        const data = await response.json();
        setClients(data);
      } catch (err) {
        setError(err.message || 'Error al obtener los clientes');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [router]);

  if (loading) return <p className="text-center text-xl text-blue-500">Cargando...</p>;
  if (error) return <p className="text-red-500 text-center text-xl">{error}</p>;

  return (
    <div className="container">
      <h2>Lista de Clientes</h2>
      {clients.length === 0 ? (
        <div>
          <p>Aún no tienes clientes registrados.</p>
          <button onClick={() => router.push('/crear-cliente')}>Crear mi primer cliente</button>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>
                  <button onClick={() => router.push(`/clients/${client.id}`)}>Ver Detalles</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
