import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./crearTrabajo.css";

const CrearTrabajoPage = ({ onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    id_persona: 1, // Este vendría del contexto de usuario autenticado
    titulo_trabajo: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'Postulado',
    oficios: []
  });

  // Lista de oficios disponibles (esto vendría de una API)
  const [oficiosDisponibles] = useState([
    { id: 1, nombre: 'Carpintero', icon: '🔨' },
    { id: 2, nombre: 'Plomero', icon: '🔧' },
    { id: 3, nombre: 'Electricista', icon: '⚡' },
    { id: 4, nombre: 'Pintor', icon: '🎨' },
    { id: 5, nombre: 'Albañil', icon: '🧱' },
    { id: 6, nombre: 'Jardinero', icon: '🌱' },
    { id: 7, nombre: 'Mecánico', icon: '🔧' },
    { id: 8, nombre: 'Soldador', icon: '🔥' }
  ]);

  const [errores, setErrores] = useState({});

  // Manejar cambios en inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo si existe
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Manejar selección de oficios
  const handleOficioToggle = (oficioId) => {
    setFormData(prev => ({
      ...prev,
      oficios: prev.oficios.includes(oficioId)
        ? prev.oficios.filter(id => id !== oficioId)
        : [...prev.oficios, oficioId]
    }));
  };

  // Validar formulario
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.titulo_trabajo.trim()) {
      nuevosErrores.titulo_trabajo = 'El título es obligatorio';
    }

    if (!formData.descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción es obligatoria';
    }

    if (!formData.fecha_inicio) {
      nuevosErrores.fecha_inicio = 'La fecha de inicio es obligatoria';
    }

    if (!formData.fecha_fin) {
      nuevosErrores.fecha_fin = 'La fecha de fin es obligatoria';
    }

    if (formData.fecha_inicio && formData.fecha_fin) {
      if (new Date(formData.fecha_inicio) >= new Date(formData.fecha_fin)) {
        nuevosErrores.fecha_fin = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    if (formData.oficios.length === 0) {
      nuevosErrores.oficios = 'Selecciona al menos un oficio';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      // Simular llamada API
      const response = await fetch('/api/trabajos/guardar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

  if (response.ok) {
    setMensaje({ tipo: 'success', texto: 'Trabajo creado exitosamente' });
    setTimeout(() => {
      if (onClose) onClose();
    }, 2000);
      } else {
        setMensaje({ 
          tipo: 'error', 
          texto: result.message || 'Error al crear el trabajo' 
        });
      }
    } catch (error) {
      setMensaje({ 
        tipo: 'error', 
        texto: 'Error de conexión. Inténtalo de nuevo.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate('/');
  };

  return (
    <div className="crear-trabajo-container">
      <div className="crear-trabajo-header">
        <h1 className="page-title">
          <span className="title-icon">💼</span>
          Crear Nuevo Trabajo
        </h1>
        <p className="page-subtitle">
          Describe el trabajo que necesitas realizar y selecciona los oficios requeridos
        </p>
      </div>

      {mensaje.texto && (
        <div className={`mensaje ${mensaje.tipo}`}>
          <span className="mensaje-icon">
            {mensaje.tipo === 'success' ? '✅' : '❌'}
          </span>
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="crear-trabajo-form">
        {/* Información básica */}
        <div className="form-section">
          <h2 className="section-title">
            <span className="section-icon">📝</span>
            Información del Trabajo
          </h2>
          
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="titulo_trabajo" className="form-label">
                Título del Trabajo *
              </label>
              <input
                type="text"
                id="titulo_trabajo"
                name="titulo_trabajo"
                value={formData.titulo_trabajo}
                onChange={handleInputChange}
                className={`form-input ${errores.titulo_trabajo ? 'error' : ''}`}
                placeholder="Ej: Reparación de tubería en cocina"
                maxLength="100"
              />
              {errores.titulo_trabajo && (
                <span className="error-message">{errores.titulo_trabajo}</span>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="descripcion" className="form-label">
                Descripción Detallada *
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                className={`form-textarea ${errores.descripcion ? 'error' : ''}`}
                placeholder="Describe detalladamente el trabajo que necesitas, materiales, ubicación, etc."
                rows="5"
                maxLength="500"
              />
              <div className="char-count">
                {formData.descripcion.length}/500 caracteres
              </div>
              {errores.descripcion && (
                <span className="error-message">{errores.descripcion}</span>
              )}
            </div>
          </div>
        </div>

        {/* Fechas */}
        <div className="form-section">
          <h2 className="section-title">
            <span className="section-icon">📅</span>
            Cronograma
          </h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="fecha_inicio" className="form-label">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                id="fecha_inicio"
                name="fecha_inicio"
                value={formData.fecha_inicio}
                onChange={handleInputChange}
                className={`form-input ${errores.fecha_inicio ? 'error' : ''}`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errores.fecha_inicio && (
                <span className="error-message">{errores.fecha_inicio}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="fecha_fin" className="form-label">
                Fecha de Finalización *
              </label>
              <input
                type="date"
                id="fecha_fin"
                name="fecha_fin"
                value={formData.fecha_fin}
                onChange={handleInputChange}
                className={`form-input ${errores.fecha_fin ? 'error' : ''}`}
                min={formData.fecha_inicio || new Date().toISOString().split('T')[0]}
              />
              {errores.fecha_fin && (
                <span className="error-message">{errores.fecha_fin}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="estado" className="form-label">
                Estado Inicial
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="Postulado">Postulado</option>
                <option value="En Revisión">En Revisión</option>
                <option value="Programado">Programado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Oficios */}
        <div className="form-section">
          <h2 className="section-title">
            <span className="section-icon">🔨</span>
            Oficios Requeridos *
          </h2>
          <p className="section-description">
            Selecciona todos los oficios que necesitas para este trabajo
          </p>
          
          <div className="oficios-grid">
            {oficiosDisponibles.map(oficio => (
              <div
                key={oficio.id}
                className={`oficio-card ${formData.oficios.includes(oficio.id) ? 'selected' : ''}`}
                onClick={() => handleOficioToggle(oficio.id)}
              >
                <span className="oficio-icon">{oficio.icon}</span>
                <span className="oficio-nombre">{oficio.nombre}</span>
                {formData.oficios.includes(oficio.id) && (
                  <span className="selected-indicator">✓</span>
                )}
              </div>
            ))}
          </div>
          
          {errores.oficios && (
            <span className="error-message">{errores.oficios}</span>
          )}
          
          {formData.oficios.length > 0 && (
            <div className="oficios-seleccionados">
              <p>Oficios seleccionados: {formData.oficios.length}</p>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="form-actions">
          <button
            type="button"
            onClick={handleVolver}
            className="btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creando...
              </>
            ) : (
              <>
                <span>Crear Trabajo</span>
                <span>💼</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearTrabajoPage;