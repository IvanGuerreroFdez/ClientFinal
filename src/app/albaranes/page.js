'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookie from 'js-cookie';
import '../styles/albaranes.css';

export default function DeliveryNotesPage() {
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newDeliveryNote, setNewDeliveryNote] = useState({
    clientId: '',
    projectId: '',
    format: 'material',
    material: '',
    hours: 0,
    description: '',
    workdate: '',
  });
  const [selectedDeliveryNote, setSelectedDeliveryNote] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookie.get('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    // Obtener albaranes
    const fetchDeliveryNotes = async () => {
      try {
        const response = await fetch('https://bildy-rpmaya.koyeb.app/api/deliverynote', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('No se pudieron cargar los albaranes');
        }

        const data = await response.json();
        setDeliveryNotes(data);
      } catch (err) {
        setError(err.message || 'Error al obtener los albaranes');
      }
    };

    // Obtener clientes
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
      }
    };

    // Obtener proyectos
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://bildy-rpmaya.koyeb.app/api/project', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('No se pudieron cargar los proyectos');
        }

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message || 'Error al obtener los proyectos');
      }
    };

    fetchDeliveryNotes();
    fetchClients();
    fetchProjects();
  }, [router]);

  const handleCreateDeliveryNote = async (e) => {
    e.preventDefault();
    const { clientId, projectId, format, material, hours, description, workdate } = newDeliveryNote;

    if (!clientId || !projectId || !format || !material || !hours || !description || !workdate) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const token = Cookie.get('authToken');

    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/deliverynote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDeliveryNote),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el albarán');
      }

      const createdDeliveryNote = await response.json();
      setDeliveryNotes((prevNotes) => [...prevNotes, createdDeliveryNote]);
      setShowSuccessPopup(true);
      setShowForm(false);
      setNewDeliveryNote({
        clientId: '',
        projectId: '',
        format: 'material',
        material: '',
        hours: 0,
        description: '',
        workdate: '',
      });

      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (err) {
      setError(err.message || 'Error al crear el albarán');
    }
  };

  // Seleccionar un albarán para ver los detalles
  const handleSelectDeliveryNote = (noteId) => {
    const selectedNote = deliveryNotes.find(note => note._id === noteId);
    setSelectedDeliveryNote(selectedNote);

    const client = clients.find(client => client._id === selectedNote.clientId);
    setSelectedClient(client);

  };

  // Función para descargar el albarán en PDF
  const handleDownloadPdf = async (noteId) => {
    const token = Cookie.get('authToken');
    try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/pdf/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo descargar el albarán en PDF');
      }

      // Crear un enlace para descargar el archivo PDF
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `albaran_${noteId}.pdf`;
      link.click();
    } catch (err) {
      setError(err.message || 'Error al descargar el albarán en PDF');
    }
  };

  if (error) return <p className="error">{error}</p>;
  return (
    <div className="container">
      <h2>Albaranes</h2>

      {/* Botón para crear un nuevo albarán */}
      <button className="create-client-btn" onClick={() => setShowForm(true)}>
        Crear Albarán
      </button>

      {deliveryNotes.length === 0 ? (
        <div>No hay albaranes registrados.</div>
      ) : (
        <div className="delivery-notes-list">
          <ul>
            {deliveryNotes.map((note) => (
              <li key={note._id}>
                <button onClick={() => handleSelectDeliveryNote(note._id)}>
                  {note.description}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mostrar detalles del albarán seleccionado */}
      {selectedDeliveryNote && (
        <div className="delivery-note-details">
          <h3>Detalles del Albarán</h3>
          <p><strong>Descripción:</strong> {selectedDeliveryNote.description}</p>
          <p><strong>Material:</strong> {selectedDeliveryNote.material}</p>
          <p><strong>Horas:</strong> {selectedDeliveryNote.hours}</p>
          <p><strong>Cliente:</strong> {selectedClient ? selectedClient.name : 'No disponible'}</p>
          <p><strong>Proyecto:</strong> {selectedDeliveryNote.projectId ? selectedDeliveryNote.projectId.name : 'No disponible'}</p>
          <p><strong>Fecha de Trabajo:</strong> {selectedDeliveryNote.workdate}</p>
          <p><strong>Formato:</strong> {selectedDeliveryNote.format}</p>
          <p><strong>Creado en:</strong> {new Date(selectedDeliveryNote.createdAt).toLocaleString()}</p>
          <p><strong>Actualizado en:</strong> {new Date(selectedDeliveryNote.updatedAt).toLocaleString()}</p>

          {/* Botón para descargar el albarán en PDF */}
          <button className='albaran-pdf-button' onClick={() => handleDownloadPdf(selectedDeliveryNote._id)}>
            Descargar PDF
          </button>
        </div>
      )}

      {/* Formulario para crear un nuevo albarán */}
      {showForm && (
        <div className="form-container">
          <h3>Crear Nuevo Albarán</h3>
          <form onSubmit={handleCreateDeliveryNote}>
            <div>
              <label>Cliente</label>
              <select
                value={newDeliveryNote.clientId}
                onChange={(e) =>
                  setNewDeliveryNote({ ...newDeliveryNote, clientId: e.target.value })
                }
                required
              >
                <option value="">Seleccionar Cliente</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Proyecto</label>
              <select
                value={newDeliveryNote.projectId}
                onChange={(e) =>
                  setNewDeliveryNote({ ...newDeliveryNote, projectId: e.target.value })
                }
                required
              >
                <option value="">Seleccionar Proyecto</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Formato</label>
              <select
                value={newDeliveryNote.format}
                onChange={(e) =>
                  setNewDeliveryNote({ ...newDeliveryNote, format: e.target.value })
                }
                required
              >
                <option value="material">Material</option>
                <option value="hours">Horas</option>
              </select>
            </div>

            <div>
              <label>Material</label>
              <input
                type="text"
                value={newDeliveryNote.material}
                onChange={(e) =>
                  setNewDeliveryNote({ ...newDeliveryNote, material: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label>Horas</label>
              <input
                type="number"
                value={newDeliveryNote.hours}
                onChange={(e) =>
                  setNewDeliveryNote({ ...newDeliveryNote, hours: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label>Descripción</label>
              <input
                type="text"
                value={newDeliveryNote.description}
                onChange={(e) =>
                  setNewDeliveryNote({ ...newDeliveryNote, description: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label>Fecha de Trabajo</label>
              <input
                type="date"
                value={newDeliveryNote.workdate}
                onChange={(e) =>
                  setNewDeliveryNote({ ...newDeliveryNote, workdate: e.target.value })
                }
                required
              />
            </div>

            <button type="submit">Guardar</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
          </form>
        </div>
      )}

      {/* Popup de éxito */}
      {showSuccessPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="popup-close" onClick={() => setShowSuccessPopup(false)}>
              &times;
            </span>
            <div className="popup-icon">✔️</div>
            <p>Albarán creado con éxito</p>
          </div>
        </div>
      )}
    </div>
  );
}
