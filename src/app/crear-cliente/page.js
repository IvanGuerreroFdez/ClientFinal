'use client'; // Asegura que este componente se ejecute en el cliente

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateClientPage() {
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [postal, setPostal] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [cif, setCif] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificamos que todos los campos estén llenos
    if (!name || !street || !number || !postal || !city || !province || !cif) {
      setError('Por favor, llena todos los campos obligatorios');
      return;
    }

    // Preparamos los datos del cliente en formato JSON
    const clientData = {
      name,
      cif,
      address: {
        street: `${street}, ${number}`,  // Calle y número combinados
        postal,
        city,
        province,
      },
    };

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No estás autenticado. Inicia sesión para continuar.');
        return;
      }

      // Realizamos la solicitud POST para crear el cliente
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(clientData), // Enviamos los datos en formato JSON
      });

      if (!response.ok) {
        throw new Error('No se pudo crear el cliente');
      }

      const data = await response.json();
      setSuccessMessage('Cliente creado exitosamente');
      setTimeout(() => {
        router.push('/clientes');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Hubo un problema al crear el cliente');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Crear Cliente</h1>
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="flex justify-center gap-6">
        {/* Rectángulo central para los campos principales */}
        <div className="w-full sm:w-2/3 lg:w-3/4 bg-gray-50 p-6 rounded-lg shadow-lg flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nombre del Cliente</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Dirección Fiscal</label>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Calle"
                  required
                />
                <input
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Número"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Código Postal</label>
              <input
                type="text"
                value={postal}
                onChange={(e) => setPostal(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Ciudad</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Provincia</label>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">CIF</label>
            <input
              type="text"
              value={cif}
              onChange={(e) => setCif(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500 mr-4"
              onClick={() => router.push('/clientes')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Crear Cliente
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
