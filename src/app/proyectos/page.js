'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookie from 'js-cookie';
import '../styles/proyectos.css';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    projectCode: '',
    code: '',
    email: '',
    address: {
      street: '',
      number: '',
      postal: '',
      city: '',
      province: '',
    },
    clientId: '',
  });
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

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
          throw new Error('Error al cargar clientes');
        }

        const data = await response.json();
        setClients(data);
      } catch (err) {
        setError(err.message || 'Error al obtener los clientes');
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await fetch('https://bildy-rpmaya.koyeb.app/api/project', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar proyectos');
        }

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message || 'Error al obtener los proyectos');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
    fetchProjects();
  }, [router]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const { name, projectCode, code, address, clientId, email } = newProject;

    if (!name || !projectCode || !code || !address.street || !address.number || !address.postal || !address.city || !address.province || !clientId || !email) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const token = Cookie.get('authToken');

    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el proyecto');
      }

      const createdProject = await response.json();
      setProjects((prevProjects) => [...prevProjects, createdProject]);
      setShowSuccessPopup(true);
      setShowForm(false);
      setNewProject({
        name: '',
        projectCode: '',
        code: '',
        email: '',
        address: { street: '', number: '', postal: '', city: '', province: '' },
        clientId: '',
      });
    } catch (err) {
      setError(err.message || 'Error al crear el proyecto');
    }
  };

  const handleEditProject = async () => {
    const { name, projectCode, code, address, clientId, email } = selectedProject;
  
    if (!name || !projectCode || !code || !address.street || !address.number || !address.postal || !address.city || !address.province || !clientId || !email) {
      setError('Completa todos los campos obligatorios!');
      return;
    }
  
    const token = Cookie.get('authToken');
  
    try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/${selectedProject._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedProject),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el proyecto');
      }
  
      const updatedProject = await response.json();
      setProjects((prevProjects) =>
        prevProjects.map((proj) => (proj._id === updatedProject._id ? updatedProject : proj))
      );
      setSelectedProject(updatedProject);
      setError('');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Error al actualizar el proyecto');
    }
  };
  
  const handleCancelEdit = () => {
    setSelectedProject({ ...selectedProject });
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
        <div className="sidebar">
          <h2>Proyectos</h2>
          <button className="create-button" onClick={() => setShowForm(true)}>
              Crear Proyecto
          </button>
      
          {projects.length === 0 ? (
              <div>No hay proyectos registrados.</div>
          ) : (
              <div className="projects-list">
              <ul>
                  {projects.map((project) => (
                  <li key={project._id}>
                    <button onClick={() => setSelectedProject(project)}>
                      {project.name}
                    </button>
                  </li>
                  ))}
              </ul>
              </div>
          )}
      
          {showForm && (
          <div className="details">
              <h3>Crear Nuevo Proyecto</h3>
              <form onSubmit={handleCreateProject}>
              <div>
                  <label>Nombre del Proyecto </label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    required
                  />
              </div>
              <div>
                  <label>Código del Proyecto </label>
                  <input
                    type="text"
                    value={newProject.projectCode}
                    onChange={(e) => setNewProject({ ...newProject, projectCode: e.target.value })}
                    required
                  />
              </div>
              <div>
                  <label>Código Interno </label>
                  <input
                    type="text"
                    value={newProject.code}
                    onChange={(e) => setNewProject({ ...newProject, code: e.target.value })}
                    required
                  />
              </div>
              <div>
                  <label>Email del Proyecto </label>
                  <input
                    type="email"
                    value={newProject.email}
                    onChange={(e) => setNewProject({ ...newProject, email: e.target.value })}
                    required
                  />
              </div>
              <div>
                  <label>Selecciona el Cliente </label>
                  <select
                    value={newProject.clientId}
                    onChange={(e) => setNewProject({ ...newProject, clientId: e.target.value })}
                    required
                  >
                  <option value="">Seleccione un Cliente</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.name}
                    </option>
                  ))}
                  </select>
              </div>
              <div>
                  <h4>Detalles de Dirección:</h4>
                  <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                  <li>
                      <label>Calle </label>
                      <input
                      type="text"
                      value={newProject.address.street}
                      onChange={(e) =>
                        setNewProject({ ...newProject, address: { ...newProject.address, street: e.target.value } })
                      }
                      required
                      />
                  </li>
                  <li>
                      <label>Número </label>
                      <input
                        type="text"
                        value={newProject.address.number}
                        onChange={(e) =>
                          setNewProject({ ...newProject, address: { ...newProject.address, number: e.target.value } })
                        }
                        required
                      />
                  </li>
                  <li>
                      <label>Código Postal </label>
                      <input
                        type="text"
                        value={newProject.address.postal}
                        onChange={(e) =>
                          setNewProject({ ...newProject, address: { ...newProject.address, postal: e.target.value } })
                        }
                        required
                      />
                  </li>
                  <li>
                      <label>Ciudad </label>
                      <input
                        type="text"
                        value={newProject.address.city}
                        onChange={(e) =>
                          setNewProject({ ...newProject, address: { ...newProject.address, city: e.target.value } })
                        }
                        required
                      />
                  </li>
                  <li>
                      <label>Provincia </label>
                      <input
                        type="text"
                        value={newProject.address.province}
                        onChange={(e) =>
                          setNewProject({ ...newProject, address: { ...newProject.address, province: e.target.value } })
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
        </div>

        {selectedProject && isEditing && (
          <div className="details">
            <h3>Editar Proyecto</h3>
            <form onSubmit={handleEditProject}>
                <div>
                <label>Nombre del Proyecto </label>
                <input
                  type="text"
                  value={selectedProject.name}
                  onChange={(e) =>
                  setSelectedProject({ ...selectedProject, name: e.target.value })
                  }
                  required
                />
                </div>
                <div>
                <label>Código del Proyecto </label>
                <input
                  type="text"
                  value={selectedProject.projectCode}
                  onChange={(e) =>
                  setSelectedProject({ ...selectedProject, projectCode: e.target.value })
                  }
                  required
                />
                </div>
                <div>
                <label>Código Interno </label>
                <input
                  type="text"
                  value={selectedProject.code}
                  onChange={(e) =>
                  setSelectedProject({ ...selectedProject, code: e.target.value })
                  }
                  required
                />
                </div>
                <div>
                <label>Email del Proyecto </label>
                <input
                  type="email"
                  value={selectedProject.email}
                  onChange={(e) =>
                  setSelectedProject({ ...selectedProject, email: e.target.value })
                  }
                  required
                />
                </div>
                <div>
                <label>Selecciona el Cliente </label>
                <select
                    value={selectedProject.clientId}
                    onChange={(e) =>
                    setSelectedProject({ ...selectedProject, clientId: e.target.value })
                    }
                    required
                >
                    <option value="">Seleccione un Cliente </option>
                    {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                        {client.name}
                    </option>
                    ))}
                </select>
                </div>
                <div>
                <h4>Detalles de Dirección:</h4>
                <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                    <li>
                    <label>Calle </label>
                    <input
                      type="text"
                      value={selectedProject.address.street}
                      onChange={(e) =>
                      setSelectedProject({ ...selectedProject, address: { ...selectedProject.address, street: e.target.value } })
                      }
                      required
                    />
                    </li>
                    <li>
                    <label>Número </label>
                    <input
                      type="text"
                      value={selectedProject.address.number}
                      onChange={(e) =>
                      setSelectedProject({ ...selectedProject, address: { ...selectedProject.address, number: e.target.value } })
                      }
                      required
                    />
                    </li>
                    <li>
                    <label>Código Postal </label>
                    <input
                      type="text"
                      value={selectedProject.address.postal}
                      onChange={(e) =>
                      setSelectedProject({ ...selectedProject, address: { ...selectedProject.address, postal: e.target.value } })
                      }
                      required
                    />
                    </li>
                    <li>
                    <label>Ciudad </label>
                    <input
                      type="text"
                      value={selectedProject.address.city}
                      onChange={(e) =>
                      setSelectedProject({ ...selectedProject, address: { ...selectedProject.address, city: e.target.value } })
                      }
                      required
                    />
                    </li>
                    <li>
                    <label>Provincia </label>
                    <input
                      type="text"
                      value={selectedProject.address.province}
                      onChange={(e) =>
                      setSelectedProject({ ...selectedProject, address: { ...selectedProject.address, province: e.target.value } })
                      }
                      required
                    />
                    </li>
                </ul>
                </div>
                <button type="submit">Guardar</button>
                <button type="button" onClick={handleCancelEdit}>
                Cancelar
                </button>
              </form>
          </div>
        )}
      
        {selectedProject && !isEditing && (
          <div className="details">
            <h3>Detalles del Proyecto</h3>
            <p><strong>Nombre:</strong> {selectedProject.name}</p>
            <p><strong>Código del Proyecto:</strong> {selectedProject.projectCode}</p>
            <p><strong>Código Interno:</strong> {selectedProject.code}</p>
            <p><strong>Dirección:</strong> {selectedProject.address.street}, {selectedProject.address.city}</p>
            <p><strong>ID del Proyecto:</strong> {selectedProject._id}</p>
            <p><strong>ID del Cliente:</strong> {selectedProject.clientId}</p>
            <p><strong>Creado en:</strong> {new Date(selectedProject.createdAt).toLocaleString()}</p>
            <p><strong>Actualizado en:</strong> {new Date(selectedProject.updatedAt).toLocaleString()}</p>
            <button onClick={handleEditClick}>Editar</button>
            <button onClick={handleCancelEdit}>Cancelar</button>
          </div>
        )}
  
        {showSuccessPopup && (
          <div className="popup">
            <div className="popup-content">
              <span className="popup-close" onClick={() => setShowSuccessPopup(false)}>
                &times;
              </span>
              <div className="popup-icon">✔️</div>
              <p>Proyecto actualizado con éxito</p>
            </div>
          </div>
        )}
    </div>
  );  
}
