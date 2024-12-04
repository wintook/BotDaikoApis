const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const Util = require("./util/util");

const app = express();
const path = require('path');
require('dotenv').config({ path: '../.env' });
app.use(bodyParser.json());

// _______________________________________________________________________________
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Access-Token'],
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
// _______________________________________________________________________________



// _______________________________________________________________________________
// Middleware autentica la solicitud verificando un token de acceso. 
// Si el token es válido, permite que la solicitud continúe; de lo contrario, 
// responde con un error 403 o 404 según corresponda.

app.use(async (req, res, next) => {
    const api_access_token = req.headers['access-token']
    if (api_access_token) {
        const profile = await Util.getProfile(api_access_token)
        if (!profile) {
            console.log(`404 Not Found`)
            res.status(404).send(`404 Not Found`)
            return false;
        }     
        next();
    } else {
        console.log(`403 access_denied`)
        res.status(403).send(`403 Access denied`)
        return false
    }
});
// _______________________________________________________________________________


app.get("/test", (req, res) => {
    const now = new Date();
    console.log(`Testing -> ## ${now.toString()} ##`);
    res.status(200).send(`Testing -> ${now.toString()}`);
});

const ArticulosRouters = require('./daiko/articulos/ArticulosRouters');
app.use('/v1', ArticulosRouters);

// ServiceDaiko
// const PORT = 9070;
// app.listen(PORT, () => {
//     console.log(`Servidor escuchando en https://localhost:${PORT}`);
// });
if (require.main === module) {
    const PORT = 9070;
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en https://localhost:${PORT}`);
    });
}

module.exports = app; // Exporta la app para ser usada en las pruebas

