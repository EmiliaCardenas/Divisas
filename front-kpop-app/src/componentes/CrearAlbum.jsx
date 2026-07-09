import { useState, useEffect } from 'react';
import axios from 'axios';

function CrearAlbum() {
    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState('Sencillo'); // Valor inicial por defecto
    const [idArtista, setIdArtista] = useState('');
    const [idColaborador, setIdColaborador] = useState('');
    const [fecha, setFecha] = useState('');
    
    // --- ESTA ES LA PARTE QUE FALTABA ---
    const [artistas, setArtistas] = useState([]);

    useEffect(() => {
        const fetchArtistas = async () => {
            try {
                const res = await axios.get('/api/kpop/artistas');
                setArtistas(res.data);
            } catch (error) {
                console.error("Error al cargar artistas:", error);
            }
        };
        fetchArtistas();
    }, []);
    // ------------------------------------

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // 1. Crear el álbum
        const response = await axios.post('/api/kpop/album', { 
            nombre, tipo, id_artista: parseInt(idArtista), fecha 
        });
        
        const nuevoIdAlbum = response.data.id_album;

        // --- DEBUG: MIRA ESTO EN TU CONSOLA ---
        console.log("Valores que voy a enviar a colaboración:", { 
            id_album: nuevoIdAlbum, 
            id_artista: idColaborador 
        });

        // 2. Si hay colaborador, crear la relación
        if (idColaborador) {
            await axios.post('/api/kpop/colaboracion', { 
                id_album: nuevoIdAlbum, 
                id_artista: parseInt(idColaborador) 
            });
            alert("Álbum y colaboración guardados con éxito");
        } else {
            alert("Álbum guardado (sin colaborador)");
        }
    } catch (error) {
        console.error("Error al guardar:", error.response ? error.response.data : error);
    }
};

    return (
        <form onSubmit={handleSubmit}>
            <h3>Crear Álbum</h3>
            <select onChange={(e) => setIdArtista(e.target.value)} required>
                <option value="">Selecciona un artista</option>
                {artistas.map(a => <option key={a.id_artista} value={a.id_artista}>{a.nombre}</option>)}
            </select>
            
            <input placeholder="Nombre del álbum" onChange={e => setNombre(e.target.value)} required />
            <input type="date" onChange={e => setFecha(e.target.value)} />
            
            <select onChange={e => setTipo(e.target.value)}>
                <option value="Sencillo">Sencillo</option>
                <option value="Mini album (EP)">Mini album (EP)</option>
                <option value="Full album (LP)">Full album (LP)</option>
                <option value="Single Album">Single Album</option>
            </select>
            
            <label>¿Tiene colaboradores?</label>
            <select onChange={(e) => setIdColaborador(e.target.value)}>
                <option value="">Ninguno</option>
                {artistas.map(a => <option key={a.id_artista} value={a.id_artista}>{a.nombre}</option>)}
            </select>
            
            <button type="submit">Guardar Álbum</button>
        </form>
    );
}

export default CrearAlbum;