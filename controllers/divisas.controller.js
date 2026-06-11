const axios = require('axios');
require('dotenv').config();

let cache = {
    data: null,
    ultimaActualizacion: null
};

const nombresMonedas = {
    "AUD": "Australian Dollar",
    "CAD": "Canadian Dollar",
    "EUR": "Euro",
    "JPY": "Japanese Yen",
    "KRW": "South Korean Won",
    "MXN": "Mexican Peso",
    "USD": "US Dollar"
};

const get_datos = async (req, res) => {
    const ahora = Date.now();
    const veinticuatroHoras = 24 * 60 * 60 * 1000;

    // Si hay caché válido, servimos los datos filtrados directamente
    if (cache.data && (ahora - cache.ultimaActualizacion < veinticuatroHoras)) {
        console.log("Sirviendo datos desde memoria...");
        return res.json({ conversion_rates: cache.data });
    }

    try {
        console.log("Llamando a la API externa...");
        const apiKey = process.env.API_KEY;
        const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

        const response = await axios.get(url);
        const rates = response.data.conversion_rates;
        
        // Creamos el objeto filtrado
        const divisasFiltradas = {};
        Object.keys(nombresMonedas).forEach(cod => {
            // Verificamos que la tasa exista en la respuesta de la API
            if (rates[cod] !== undefined) {
                divisasFiltradas[cod] = {
                    tasa: rates[cod],
                    nombre: nombresMonedas[cod]
                };
            }
        });

        // Guardamos SOLO el objeto filtrado en el caché
        cache.data = divisasFiltradas;
        cache.ultimaActualizacion = Date.now();

        res.json({ conversion_rates: divisasFiltradas });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ mensaje: "Error al obtener las divisas" });
    }
};

module.exports = { get_datos };