const cors = require('cors');   // Evitar error de CORS
const express = require('express');
const path = require('path');
const morgan = require('morgan');   // Logs
const bodyParser = require('body-parser');  // JSON requests

// Configuración de app
const app = express();

// Carpeta pública
const publicDir = path.join(__dirname, '/public');

// Middlewares globales
app.use(cors());
app.use(express.static(publicDir));
app.use(morgan('dev'));
app.use(bodyParser.json());

// Puerto dinámico (Render / Cloud)
const PORT = process.env.PORT || 3001;

// ===== RUTA RAÍZ (TEST API) =====
app.get('/', (req, res) => {
  res.send('API MARKET ONLINE 🚀');
});

// ===== RUTAS =====
require('./routes/loginRoutes')(app, null);
require('./routes/userRoutes')(app, null);
require('./routes/menusRoutes')(app, null);
require('./routes/pantallasRoutes')(app, null);
require('./routes/rolesRoutes')(app, null);
require('./routes/permisosRoutes')(app, null);
require('./routes/configRoutes')(app, null);
require('./routes/impuestosRoutes')(app, null);
require('./routes/categoriasRoutes')(app, null);
require('./routes/subCategoriasRoutes')(app, null);
require('./routes/marcasRoutes')(app, null);
require('./routes/unidadesRoutes')(app, null);
require('./routes/productosRoutes')(app, null);
require('./routes/tiendaRoutes')(app, null);
require('./routes/menusTiendaRoutes')(app, null);
require('./routes/imagenesMarquezinaRoutes')(app, null);
require('./routes/seccionesHomesRoutes')(app, null);
require('./routes/clientesRoutes')(app, null);
require('./routes/webpayRoutes')(app, null);
require('./routes/tipoPagosRoutes')(app, null);
require('./routes/ventasRoutes')(app, null);
require('./routes/despachosRoutes')(app, null);
require('./routes/ordenesCompraRoutes')(app, null);
require('./routes/dashboardRoutes')(app, null);
require('./routes/preciosRoutes')(app, null);
require('./routes/sendEmailRoutes')(app, null);
require('./routes/ciudadesRoutes')(app, null);
require('./routes/tallasRoutes')(app, null);

// ===== SERVIDOR =====
app.listen(PORT, () => {
  console.log('Servidor activo en el puerto ' + PORT);
});
