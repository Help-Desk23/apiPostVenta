const express = require('express');
const { addMarca, deleteMarca } = require('../../controllers/marca/marca');

const marcaRouter = express.Router();

//Ruta para agregar marcas

marcaRouter.post("/marca", addMarca);

//Ruta para eliminar marca

marcaRouter.delete("/marca/:id", deleteMarca);

module.exports = marcaRouter;