const express = require('express');
const { addServicios, updateServicios, deleteServicios } = require('../../controllers/servicios/servicios');

const serviciosRouter = express.Router();

//Ruta para agregar servicios

serviciosRouter.post("/servicios", addServicios);

//Ruta para actualizar servicios

serviciosRouter.patch("/servicios/:id", updateServicios);

//Ruta para eliminar servicios

serviciosRouter.delete("/servicios/:id", deleteServicios);

module.exports = serviciosRouter;
