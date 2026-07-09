import { useState, useEffect } from 'react';
import axios from 'axios';

function CrearCancion() {
    const [nombre, setNombre] = useState('');
    const [duracion, setDuracion] = useState('');
    const [idAlbum, setIdAlbum] = useState('');
    const [idColaborador, setIdColaborador] = useState(''); // Nuevo estado
    const [albumes, setAlbumes] = useState([]);
    const [artistas, setArtistas] = useState([]); // Nuevo estado

    useEffect(() => {
        axios.get('/api/kpop/albumes').then(res => setAlbumes(res.data));
        axios.get('/api/kpop/artistas').then(res => setArtistas(res.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Crear Canción
            const res = await axios.post('/api/kpop/cancion', { nombre, duracion, id_album: idAlbum });
            const idCancion = res.data.id_cancion;

            // 2. Si hay colaborador, enviarlo usando el ID de la canción
            if (idColaborador) {
                await axios.post('/api/kpop/colaboracion', { 
                    id_cancion: idCancion, 
                    id_artista: parseInt(idColaborador) 
                });
            }
            alert("¡Canción y colaboración guardadas!");
        } catch (error) { alert("Error al guardar"); }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Añadir Canción</h3>
            <select onChange={(e) => setIdAlbum(e.target.value)} required>
                <option value="">Selecciona un álbum</option>
                {albumes.map(a => <option key={a.id_album} value={a.id_album}>{a.nombre}</option>)}
            </select>
            
            <input placeholder="Nombre canción" onChange={e => setNombre(e.target.value)} required />
            <input type="number" placeholder="Duración (segundos)" onChange={e => setDuracion(e.target.value)} />
            
            <label>Colaborador (opcional):</label>
            <select onChange={(e) => setIdColaborador(e.target.value)}>
                <option value="">Ninguno</option>
                {artistas.map(a => <option key={a.id_artista} value={a.id_artista}>{a.nombre}</option>)}
            </select>
            
            <button type="submit">Guardar Canción</button>
        </form>
    );
}

export default CrearCancion;