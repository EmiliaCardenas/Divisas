const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. IMPORTACIÓN DE RUTAS
// ==========================================
const rutasDivisas = require('./routes/divisas.routes');
const rutasSuper = require('./routes/lista-super/super.routes');

// ==========================================
// 2. CONFIGURACIÓN GLOBAL DE CORS
// ==========================================
// Si tus frontends viven en dominios distintos, puedes usar un array en 'origin'
const whitelist = [
    'https://divisas-frontend.onrender.com', // Producción
    'https://lista-del-super.onrender.com', // Producción
    'http://localhost:3000',      
    'http://localhost:3001',           
    'http://localhost:5173'                 
];

/*
const whitelist = [
    'https://divisas-frontend.onrender.com', 
    'https://usuarios-admin.onrender.com',
    'https://tienda-productos.onrender.com'
];
*/

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// ==========================================
// 3. DISTRIBUCIÓN DE RUTAS (API ENDPOINTS)
// ==========================================

app.use('/api/divisas', rutasDivisas);
app.use('/api/super', rutasSuper);

// ==========================================
// 4. INICIO DEL SERVIDOR
// ==========================================
app.listen(PORT, () => {
  console.log(`Servidor monolito en modo producción corriendo en ${PORT}`);
});