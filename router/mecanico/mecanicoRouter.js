const express = require('express');
const { addMecanico, updateMecanico, deleteMecanico } = require('../../controllers/mecanico/mecanico');

const mecanicoRouter = express.Router();

//Ruta para agregar mecanicos

mecanicoRouter.post("/mecanico", addMecanico);

//Ruta para editar mecanicos

mecanicoRouter.patch("/mecanico/:id", updateMecanico);

//Ruta para eliminar mecanicos

mecanicoRouter.delete("/mecanico/:id", deleteMecanico);


module.exports = mecanicoRouter;