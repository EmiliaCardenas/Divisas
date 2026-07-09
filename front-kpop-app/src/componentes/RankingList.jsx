import { useState, useEffect } from 'react';
import axios from 'axios';

function VistaRankingCompleta() {
    const [datos, setDatos] = useState([]);
    const [votosPendientes, setVotosPendientes] = useState({});

    const cargarDatos = () => {
        axios.get('/api/kpop/catalogo').then(res => setDatos(res.data));
    };

    useEffect(() => { cargarDatos(); }, []);

    const handleCambioVoto = (id_cancion, valor) => {
        setVotosPendientes({ ...votosPendientes, [id_cancion]: valor });
    };

    const guardarTodo = async () => {
        try {
            const promesas = Object.entries(votosPendientes).map(([id_cancion, puntuacion]) => 
                axios.post('/api/kpop/rank', { id_cancion, puntuacion })
            );
            
            await Promise.all(promesas);
            alert("¡Todos los votos registrados!");
            setVotosPendientes({}); // Limpiar votos pendientes
            cargarDatos(); // Actualizar promedios desde el servidor
        } catch (error) {
            alert("Error al guardar algunos votos");
        }
    };

    const procesarDatos = (data) => {
        const arbol = {};
        data.forEach(item => {
            if (!arbol[item.artista]) arbol[item.artista] = { albumes: {}, total: 0, count: 0 };
            if (!arbol[item.artista].albumes[item.album]) arbol[item.artista].albumes[item.album] = { canciones: [], total: 0, count: 0 };
            
            const promedioCancion = parseFloat(item.promedio || 0);
            arbol[item.artista].albumes[item.album].canciones.push({ ...item, promedio: promedioCancion });
            arbol[item.artista].albumes[item.album].total += promedioCancion;
            arbol[item.artista].albumes[item.album].count += 1;
        });

        Object.entries(arbol).forEach(([nomArt, artData]) => {
            let artTotal = 0, artCount = 0;
            Object.entries(artData.albumes).forEach(([nomAlb, albData]) => {
                albData.promedio = albData.total / albData.count;
                artTotal += albData.promedio;
                artCount += 1;
            });
            artData.promedio = artTotal / artCount;
        });
        return arbol;
    };

    const estructura = procesarDatos(datos);

    return (
        <div>
            <h2>Ranking Detallado</h2>
            {Object.entries(estructura).map(([artista, artData]) => (
                <div key={artista} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                    <h3>Artista: {artista} (Promedio: {artData.promedio.toFixed(1)})</h3>
                    {Object.entries(artData.albumes).map(([album, albData]) => (
                        <div key={album} style={{ marginLeft: '20px' }}>
                            <h4>Álbum: {album} (Promedio: {albData.promedio.toFixed(1)})</h4>
                            <ul>
                            {albData.canciones.map(c => (
                                <li key={c.id_cancion} style={{ marginBottom: '8px' }}>
                                    <strong>{c.cancion}</strong> 
                                    {/* Aquí mostramos el promedio histórico como "Valor Guardado" */}
                                    <span style={{ marginLeft: '10px', color: '#555' }}>
                                        {/* Si el usuario ya votó (c.voto_personal existe), muestra ese valor. 
                                        Si no, puedes mostrar el promedio histórico.
                                        */}
                                        (Tu último voto: {c.voto_personal ? parseFloat(c.voto_personal).toFixed(1) : "N/A"})
                                    </span>
                                    
                                    <input 
                                        type="number" 
                                        min="0" 
                                        max="10"
                                        step="0.1" 
                                        placeholder="0"
                                        style={{ width: '50px', marginLeft: '10px' }}
                                        value={votosPendientes[c.id_cancion] !== undefined 
                                            ? votosPendientes[c.id_cancion] 
                                            : (c.voto_personal || "")} 
                                        onChange={(e) => handleCambioVoto(c.id_cancion, e.target.value)}
                                    />
                                </li>
                            ))}
                        </ul>
                        </div>
                    ))}
                </div>
            ))}

            <div style={{ marginTop: '30px', padding: '20px', borderTop: '2px solid #333' }}>
                <button 
                    onClick={guardarTodo} 
                    style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    Guardar Todos los Cambios
                </button>
            </div>
        </div>
    );
}

export default VistaRankingCompleta;