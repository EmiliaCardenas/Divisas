import { useState, useEffect } from 'react';
import axios from 'axios';
import CrearAlbum from './CrearAlbum';
import CrearCancion from './CrearCancion';

function AdminPanel() {
    const [nombre, setNombre] = useState('');
    const [esGrupo, setEsGrupo] = useState(false);
    const [grupos, setGrupos] = useState([]);
    const [idPadre, setIdPadre] = useState('');

    useEffect(() => {
        axios.get('/api/kpop/grupos').then(res => setGrupos(res.data));
    }, []);

    const handleGuardarArtista = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/kpop/artista', { 
                nombre, 
                es_grupo: esGrupo, 
                id_padre: idPadre || null 
            });
            alert("Artista registrado con éxito");
            setNombre(''); // Limpiar formulario
        } catch (error) {
            console.error("Error al registrar artista:", error);
        }
    };

    return (
        <div>
            {/* Sección para crear artista */}
            <section style={{ marginBottom: '40px', borderBottom: '1px solid #ccc' }}>
                <h2>Registrar Nuevo Artista</h2>
                <form onSubmit={handleGuardarArtista}>
                    <input 
                        value={nombre} 
                        onChange={e => setNombre(e.target.value)} 
                        placeholder="Nombre" 
                        required 
                    />
                    
                    <label style={{ marginLeft: '10px' }}>
                        ¿Es Grupo?
                        <input 
                            type="checkbox" 
                            checked={esGrupo}
                            onChange={e => setEsGrupo(e.target.checked)} 
                        />
                    </label>

                    {!esGrupo && (
                        <select onChange={e => setIdPadre(e.target.value)} style={{ marginLeft: '10px' }}>
                            <option value="">-- Pertenece a un grupo --</option>
                            {grupos.map(g => <option key={g.id_artista} value={g.id_artista}>{g.nombre}</option>)}
                        </select>
                    )}
                    
                    <button type="submit" style={{ marginLeft: '10px' }}>Guardar Artista</button>
                </form>
            </section>

            {/* Sección para crear álbum y canciones */}
            <section>
                <CrearAlbum />
                <CrearCancion />
            </section>
        </div>
    );
}

export default AdminPanel;