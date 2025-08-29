const express = require('express');
require('dotenv').config();
const socketIo = require('socket.io');
const http = require('http');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { clienteSocket } = require('./controllers/cliente/cliente');
const clienteRouter = require('./router/cliente/clienteRouter');
const { marcaSocket } = require('./controllers/marca/marca');
const marcaRouter = require('./router/marca/marcaRouter');
const { tallerSocket } = require('./controllers/taller/taller');
const tallerRouter = require('./router/taller/tallerRouter');
const { mecanicoSocket } = require('./controllers/mecanico/mecanico');
const mecanicoRouter = require('./router/mecanico/mecanicoRouter');
const { serviciosSocket } = require('./controllers/servicios/servicios');
const serviciosRouter = require('./router/servicios/serviciosRouter');
const { tallerServSocket } = require('./controllers/tallerServicios/tallerServicios');
const tallerServRouter = require('./router/tallerServicios/tallerServRouter');
const { citasSocket } = require('./controllers/citas/citas');
const citasRouter = require('./router/citas/citarRouter');

const server = http.createServer(app);

const allowedOrigins = [
    'http:/177.222.114.122',
    'http:/localhost',
];

const io = socketIo(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET'],
        credentials: true
    }
});

app.use(cors ({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: true
}));


io.on('connection', (socket) => {
    console.log("Cliente conectado", socket.id);

    socket.on('obtenerCliente', () => clienteSocket(socket));
    socket.on('obtenerMarca', () => marcaSocket(socket));
    socket.on('obtenerTaller', () => tallerSocket(socket));
    socket.on('obtenerMecanico', () => mecanicoSocket(socket));
    socket.on('obtenerServicios', () => serviciosSocket(socket));
    socket.on('obtenertallerServ', () => tallerServSocket(socket));
    socket.on('obtenerCitas', () => citasSocket(socket));

    socket.on('disconnect', () => {
        console.log("Cliente desconectado", socket.id);
    });
});


app.get('/', (req, res) => {
    res.end("Servidor funcionando correctamente");
})

app.use('/', clienteRouter);
app.use('/', marcaRouter);
app.use('/', tallerRouter);
app.use('/', mecanicoRouter);
app.use('/', serviciosRouter);
app.use('/', tallerServRouter);
app.use('/', citasRouter);

const PORT = process.env.API_PORT || 3001;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});