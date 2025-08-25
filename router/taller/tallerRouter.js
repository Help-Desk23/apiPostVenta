const express = require('express');
const { addTaller } = require('../../controllers/taller/taller');

const tallerRouter = express.Router();

//Ruta para agregar taller

tallerRouter.post("/taller", addTaller);

module.exports = tallerRouter;