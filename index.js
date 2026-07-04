const express = require('express');
const cors = require('cors'); 
const app = express();
const PORT = process.env.PORT || 3000; 

app.use(cors({
  origin: 'https://divisas-frontend.onrender.com', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const rutas_generales = require('./routes/general.routes');

app.use(express.json());
app.use('/', rutas_generales);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});