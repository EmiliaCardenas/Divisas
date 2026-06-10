const axios = require('axios');
require('dotenv').config();

const get_datos = async (req, res) => {
    try {
        const apiKey = process.env.API_KEY;
        const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

        const response = await axios.get(url);
        
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener las divisas" });
    }
};

module.exports = { get_datos };