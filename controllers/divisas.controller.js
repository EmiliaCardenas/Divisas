const axios = require('axios');
require('dotenv').config();

// Caché para que si se guarden los valores (sin dv)
let cache = {
    data: null,
    ultimaActualizacion: null
};

// Nombres de las monedas
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
    if (cache.data && (ahora - cache.ultimaActualizacion < veinticuatroHoras)) {
        return res.json({ conversion_rates: cache.data });
    }

    try {
        // Llamada a la api
        const apiKey = process.env.API_KEY;
        const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

        const response = await axios.get(url);
        const rates = response.data.conversion_rates;
        
        // Objeto filtrado
        const divisasFiltradas = {};
        Object.keys(nombresMonedas).forEach(cod => {
            if (rates[cod] !== undefined) {
                divisasFiltradas[cod] = {
                    tasa: rates[cod],
                    nombre: nombresMonedas[cod]
                };
            }
        });

        // Se guarda en caché
        cache.data = divisasFiltradas;
        cache.ultimaActualizacion = Date.now();

        res.json({ conversion_rates: divisasFiltradas });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ mensaje: "Error al obtener las divisas" });
    }
};

module.exports = { get_datos };