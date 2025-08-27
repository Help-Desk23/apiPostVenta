const express = require('express');
const { addTallerServ, updateTallerServ } = require('../../controllers/tallerServicios/tallerServicios');

const tallerServRouter = express.Router();

//Ruta para agregar ID de talleres y servicios

tallerServRouter.post("/taller-servicio", addTallerServ);

module.exports = tallerServRouter;