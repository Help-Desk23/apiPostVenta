const express = require('express');
const { addCitas, updateCitas, deleteCitas } = require('../../controllers/citas/citas');

const citasRouter = express.Router();

//Ruta para agregar citas

citasRouter.post("/citas", addCitas);

//Ruta para editar citas

citasRouter.patch("/citas/:id", updateCitas);

//Ruta para eliminar citas

citasRouter.delete("/citas/:id", deleteCitas);


module.exports = citasRouter;