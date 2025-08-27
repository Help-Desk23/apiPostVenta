const express = require('express');
const { addTaller, updateTaller, deleteTaller } = require('../../controllers/taller/taller');

const tallerRouter = express.Router();

//Ruta para agregar taller

tallerRouter.post("/taller", addTaller);

//Ruta para editar talleres

tallerRouter.patch("/taller/:id", updateTaller);

//Ruta para eliminar taller

tallerRouter.delete("/taller/:id", deleteTaller);

module.exports = tallerRouter;