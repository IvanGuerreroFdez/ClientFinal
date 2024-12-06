'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookie from 'js-cookie';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    cif: '',
    address: {
      street: '',
      number: '',
      postal: '',
      city: '',
      province: '',
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = Cookie.get('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchClients = async () => {
      try {
        const response = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
          headers: {
            Authorization: `Bearer ${token}`,
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

  const handleCreateClient = async (e) => {
    e.preventDefault();

    const { name, cif, address } = newClient;
    if (!name || !cif || !address.street || !address.number || !address.postal || !address.city || !address.province) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const token = Cookie.get('authToken');

    try {
      console.log('Datos enviados:', newClient);
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newClient),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.message || 'Error al crear el cliente');
      }

      const createdClient = await response.json();

      setClients((prevClients) => [...prevClients, createdClient]);
      setSuccessMessage('Cliente creado con éxito');
      setShowForm(false);
      setNewClient({
        name: '',
        cif: '',
        address: { street: '', number: '', postal: '', city: '', province: '' },
      });
    } catch (err) {
      setError(err.message || 'Error al crear el cliente');
    }
  };

  const fetchClientDetails = async (clientId) => {
    if (!clientId) {
      setError('ID del cliente no válido.');
      return;
    }

    const token = Cookie.get('authToken');

    try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los detalles del cliente.');
      }

      const clientData = await response.json();
      setSelectedClient(clientData);
    } catch (err) {
      setError(err.message || 'Error al obtener los detalles del cliente');
    }
  };

  if (loading) return <p className="text-center text-xl text-blue-500">Cargando...</p>;
  if (error) return <p className="text-red-500 text-center text-xl">{error}</p>;

  return (
    <div className="container">
      <h2>Clientes</h2>
      <button onClick={() => setShowForm(true)}>Crear Cliente</button>
      {clients.length === 0 ? (
        <div>
          <p>No hay clientes registrados.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <h3>Lista de Clientes</h3>
            <ul>
              {clients.map((client) => (
                <li key={client._id || client.id}>
                  <button onClick={() => fetchClientDetails(client._id || client.id)}>{client.name}</button>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ flex: 2 }}>
            {selectedClient ? (
              <div>
                <h3>Detalles del Cliente</h3>
                <p>Nombre del Cliente o Empresa: {selectedClient.name}</p>
                <p>CIF: {selectedClient.cif}</p>
                <p>Dirección:</p>
                <ul>
                  <li>Calle: {selectedClient.address.street}</li>
                  <li>Número: {selectedClient.address.number}</li>
                  <li>Código Postal: {selectedClient.address.postal}</li>
                  <li>Ciudad: {selectedClient.address.city}</li>
                  <li>Provincia: {selectedClient.address.province}</li>
                </ul>
              </div>
            ) : (
              <p>Selecciona un cliente para ver los detalles</p>
            )}
          </div>
        </div>
      )}
      {showForm && (
        <div>
          <h3>Crear Nuevo Cliente</h3>
          <form onSubmit={handleCreateClient}>
            <div>
              <label>Nombre del Cliente o Empresa</label>
              <input
                type="text"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label>CIF</label>
              <input
                type="text"
                value={newClient.cif}
                onChange={(e) => setNewClient({ ...newClient, cif: e.target.value })}
                required
              />
            </div>
            <div>
              <h4>Ingrese los detalles de su Dirección:</h4>
              <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                <li>
                  <label>Calle</label>
                  <input
                    type="text"
                    value={newClient.address.street}
                    onChange={(e) =>
                      setNewClient({ ...newClient, address: { ...newClient.address, street: e.target.value } })
                    }
                    required
                  />
                </li>
                <li>
                  <label>Número</label>
                  <input
                    type="text"
                    value={newClient.address.number}
                    onChange={(e) =>
                      setNewClient({ ...newClient, address: { ...newClient.address, number: e.target.value } })
                    }
                    required
                  />
                </li>
                <li>
                  <label>Código Postal</label>
                  <input
                    type="text"
                    value={newClient.address.postal}
                    onChange={(e) =>
                      setNewClient({ ...newClient, address: { ...newClient.address, postal: e.target.value } })
                    }
                    required
                  />
                </li>
                <li>
                  <label>Ciudad</label>
                  <input
                    type="text"
                    value={newClient.address.city}
                    onChange={(e) =>
                      setNewClient({ ...newClient, address: { ...newClient.address, city: e.target.value } })
                    }
                    required
                  />
                </li>
                <li>
                  <label>Provincia</label>
                  <input
                    type="text"
                    value={newClient.address.province}
                    onChange={(e) =>
                      setNewClient({ ...newClient, address: { ...newClient.address, province: e.target.value } })
                    }
                    required
                  />
                </li>
              </ul>
            </div>
            <button type="submit">Guardar</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
          </form>
        </div>
      )}
      {successMessage && <p className="text-success">{successMessage}</p>}
    </div>
  );
}
