const db = require('../../config/db');

//Controlador Socket para mostrar todo los talleres

const tallerSocket = async (socket) => {
    const query = 'SELECT * FROM taller';
    try{
        const [rows] = await db.promise().query(query);

        if(!rows || rows.length === 0){
            return socket.emit('error', {message: "No se encontro ningun taller"});
        }
        socket.emit('taller', rows);
    }catch(err){
        console.error("Error al obtener talleres", err);
        socket.emit("error", {message: "Error al obtener talleres"});
    }
};

//Controlador POST para ingresar talleres

const addTaller = async (req, res) => {
    const {id_marca, taller, direccion, horario, longitud, latitud, estado} = req.body;
    const fecha_registro = new Date();

    try{
        const query = 'INSERT INTO taller (id_marca, taller, direccion, horario, longitud, latitud, estado) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [id_marca, taller, direccion, horario, longitud, latitud, estado || 'activo', fecha_registro];

        db.query(query, values, (error, result) => {
            if(error){
                console.error("Error al ingresar talleres", error);
                return res.status(500).json({error: "Error al ingresar talleres"});
            }
            res.status(201).json({ message: "Taller ingresado correctamente" });
        });
    }catch(err){
        res.status(500).json({error: "Error interno del servidor"})
    }
};

//Controlador PATCH para editar los talleres

const updateTaller = async (req, res) => {
    const {id} = req.params;
    const {id_marca, taller, direccion, horario, longitud, latitud, estado} = req.body;
    const fecha_registro = new Date();

    try{
        const update = [];
        const values = [];

        if(id_marca){
            update.push('id_marca = ?');
            values.push(id_marca);
        } 

        if(taller){
            update.push('taller = ?');
            values.push(taller);
        }

        if(direccion){
            update.push('direccion = ?');
            values.push(direccion);
        }

        if(horario){
            update.push('horario = ?');
            values.push(horario);
        }

        if(longitud){
            update.push('longitud = ?');
            values.push(longitud);
        }

        if(latitud){
            update.push('latitud = ?');
            values.push(latitud);
        }
        
        if(estado){
            if(estado !== 'activo' && 'inactivo'){
                return res.status(400).json({error: "Los valores de el campo 'estado' tiene que ser 'activo' o 'inactivo'"});
            }
            update.push('estado = ?');
            values.push(estado);
        }

        if(update.length == 0){
            return res.status(400).json({error: "No se proporciono ningun campo para actualizar"});
        }

        const query = `UPDATE taller SET ${update.join(', ')} WHERE id_taller = ?`;
        values.push(id);

        const [result] = await db.promise().query(query, values);

        if(result.affectedRows === 0){
            return res.status(404).json({ error: "Taller no encontrado" });
        }
        res.status(200).json({ message: "Taller actualizado correctamente" });
    }catch(err){
        console.error("Error al actualizar taller", err)
        res.status(500).json({ error: "Error interno del servidor"});
    }
};

//Controlador DELETE para eliminar talleres

const deleteTaller = async (req, res) => {
    const {id} = req.params;
    const query = 'DELETE FROM taller WHERE id_taller = ?';
    const values = [id];

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar taller", error);
            return res.status(500).json({error: "Error al eliminar taller"});
        } else {
            res.status(201).json({ message: "Taller eliminado correctamente"});
        }
    });
};

module.exports = {
    tallerSocket,
    addTaller,
    updateTaller,
    deleteTaller
};