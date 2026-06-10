const express = require('express');
const app = express();
const PORT = 3000;

const rutas_generales = require('./routes/general.routes');

app.use(express.json());
app.use(express.static('public'));

app.use('/', rutas_generales);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});