const express = require('express');
const { addCitas, updateCitas } = require('../../controllers/citas/citas');

const citasRouter = express.Router();

//Ruta para agregar citas

citasRouter.post("/citas", addCitas);

//Ruta para editar citas

citasRouter.patch("/citas/:id", updateCitas);


module.exports = citasRouter;