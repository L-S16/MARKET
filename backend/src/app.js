const cors = require('cors');   
const express = require('express');
const path = require('path');

const publicDir = path.join(__dirname, '/public');  

const app = express();
app.use(express.static(publicDir)); 
app.use(cors());

const morgan = require('morgan');   
const bodyParser = require('body-parser');  


app.set('port', process.env.PORT || 3001);

// middlewares
app.use(morgan('dev')); 
app.use(bodyParser.json()); 

// rutas
require('./routes/loginRoutes')(app, null);
require('./routes/userRoutes')(app, null);
require('./routes/menusRoutes')(app, null);
require('./routes/pantallasRoutes')(app, null);
require('./routes/rolesRoutes')(app, null);
require('./routes/permisosRoutes')(app, null);
require('./routes/configRoutes')(app, null);
require('./routes/impuestosRoutes')(app, null);
require('./routes/categoriasRoutes')(app, null);
require('./routes/SubCategoriasRoutes')(app, null);
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


// 🔥 CLOUD READY (Render compatible)
app.listen(app.get('port'), () => {
    console.log('Servidor activo en el puerto ' + app.get('port'));
});
