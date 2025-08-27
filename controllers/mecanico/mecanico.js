const db = require('../../config/db');

//Controlador Socket para mostrar los mecanicos

const mecanicoSocket = async (socket) => {
    const query = 'SELECT * FROM mecanicos';

    try{
        const [rows] = await db.promise().query(query);

        if(!rows || rows.length === 0){
            return socket.emit('error', { message: "No se encontro ningun mecanico"});
        }
        socket.emit('mecanico', rows);
    }catch(err){
        console.error("Error al obtener los mecanicos", err);
        socket.emit('error')
    }
};

//Controlador POST para agregar mecanicos

const addMecanico = async (req, res) => {
    const {id_taller, nombre, estado} = req.body;
    const fecha_registro = new Date();

    try{
        const query = 'INSERT INTO mecanicos (id_taller, nombre, estado, fecha_registro) VALUES (?, ?, ?, ?)';
        const values = [id_taller, nombre, estado || 'activo', fecha_registro]

        await db.promise().query(query, values);
        res.status(201).json({ message: "Mecanico ingresado correctamente" });
    }catch(err){
        console.error("Error al ingresar mecanico", err);
        res.status(500).json({ error: "Error interno del servidor" })
    }
};

//Controlador PATCH para editar mecanicos

const updateMecanico = async (req, res) => {
    const { id } = req.params;
    const { id_taller, nombre, estado } = req.body;

    try{
        const update = [];
        const values = [];

        if(id_taller){
            update.push('id_taller = ?');
            values.push(id_taller);
        }

        if(nombre){
            update.push('nombre = ?');
            values.push(nombre);
        }

        if(estado){
            if(estado !== 'activo' && 'inactivo'){
                return res.status(400).json({ error: "Los valores de el campo 'estado' tiene que ser 'activo' o 'inactivo'"});
            }
            update.push('estado = ?');
            values.push(estado);
        }

        if(update.length == 0){
            return res.status(400).json({ error: "No se proporciono ningun campo para actualizar"});
        }

        const query = `UPDATE mecanicos SET ${update.join(', ')} WHERE id_mecanico = ?`;
        values.push(id);

        const [result] = await db.promise().query(query, values);

        if(result.affectedRows === 0){
            return res.status(404).json({ error: "Mecanico no encontrado" });
        }
        res.status(200).json({ message: "Mecanico actualizado correctamente" });
    }catch(err){
        console.error("Error al actualizar mecanico", err);
        res.status(500).json({ error: "Error interno del servidor"});
    }
};

//Controlador DELETE para eliminar mecanicos

const deleteMecanico = async (req, res) => {
    const {id} = req.params;
    const query = 'DELETE FROM mecanicos WHERE id_mecanico = ?';
    const values = [id];

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar mecanico", error);
            return res.status(500).json({ error: "Error al eliminar mecanico"})
        } else{
            res.status(201).json({ message: "Mecanico eliminado correctamente"});
        }
    });
};

module.exports = {
    mecanicoSocket,
    addMecanico,
    updateMecanico,
    deleteMecanico
};