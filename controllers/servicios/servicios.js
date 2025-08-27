const db = require('../../config/db');

//Controlador Socket para mostrar todo los servicios

const serviciosSocket = async (socket) => {
    const query = 'SELECT * FROM servicios';
    try{
        const [rows] = await db.promise().query(query);

        if(!rows || rows.length === 0){
            return socket.emit('error', { message: "No se encontro ningun servicio"});
        }
        socket.emit('servicio', rows);
    }catch(err){
        console.error("Error al obtener servicios", err);
        socket.emit("error", {message: "Error al obtener servicios"});
    }
};

//Controlador POST para ingresar servicios

const addServicios = async (req, res) => {
    const {servicio, descripcion, tiempo_servicio} = req.body;
    const fecha_registro = new Date();

    try{
        const query = 'INSERT INTO servicios (servicio, descripcion, tiempo_servicio, fecha_registro) VALUES (?, ?, ?, ?)';
        const values = [servicio, descripcion, tiempo_servicio, fecha_registro]

        db.query(query, values, (error, result) => {
            if(error){
                console.error("Error al ingresar servicios", error);
                return res.status(500).json({ error: "Error al registrar servicios"});
            }
            res.status(201).json({ message: "Servicios ingresados correctamente" });
        });
    }catch(err){
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

//Controlador PATCH para editar servicios

const updateServicios = async (req, res) => {
    const {id} = req.params;
    const {servicio, descripcion, tiempo_servicio} = req.body;

    try{
        const update = [];
        const values = [];
        
        if(servicio){
            update.push('servicio = ?');
            values.push(servicio);
        }

        if(descripcion){
            update.push('descripcion = ?');
            values.push(descripcion);
        }

        if(tiempo_servicio){
            update.push('tiempo_servicio = ?');
            values.push(tiempo_servicio);
        }

        if(update.length == 0){
            return res.status(400).json({ error: "No se proporciono ningun campo para actualizar"});
        }

        const query = `UPDATE servicios SET ${update.join(', ')} WHERE id_servicio = ?`;
        values.push(id);

        const [result] = await db.promise().query(query, values);

        if(result.affectedRows === 0){
            return res.status(404).json({ error: "Servicio no encontrado" });
        }
        res.status(200).json({ message: "Servicios actualizado correctamente"});
    }catch(err){
        console.error("Error al actualizar servicios", err);
        res.status(500).json({ error: "Error del servidor"});
    }
};

//Controlador DELETE para eliminar servicios

const deleteServicios = async (req, res) => {
    const {id} = req.params;
    const query = 'DELETE FROM servicios WHERE id_servicios = ?';
    const values = [id];

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar un servicio", error);
            return res.status(500).json({ error: "Error al eliminar un servicio"});
        }else {
            res.status(201).json({ message: "Servicio eliminado correctamente"});
        }
    });
};

module.exports = {
    serviciosSocket,
    addServicios,
    updateServicios,
    deleteServicios
};