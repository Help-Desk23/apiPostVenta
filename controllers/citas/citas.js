const db = require('../../config/db');

//Controlador Socket para mostrar las citas

const citasSocket = async (socket) => {
    const query = 'SELECT * FROM citas';

    try{
        const [rows] = await db.promise().query(query);

        if(!rows || rows.length === 0){
            return socket.emit('error', { message: "No se encontro ninguna cita"});
        }
        socket.emit('citas', rows);
    }catch(err){
        console.error("Error al obtener citas", err);
        socket.emit("error", { message: "Error al obtener citas" });
    }
};

//Controlador POST para agregar citas

const addCitas = async (req, res) => {
    const { id_cliente, id_taller, id_servicio, id_mecanico, fecha, hora, estado } = req.body;
    const fecha_registro = new Date();

    try {
        const estadosValidos = ['pendiente', 'confirmado', 'cancelado', 'completada'];
        const estadoFinal = estado || 'pendiente';
        if (!estadosValidos.includes(estadoFinal)) {
            return res.status(400).json({
                error: "El campo 'estado' solo puede ser 'pendiente', 'confirmado', 'cancelado' o 'completada'"
            });
        }

        if (isNaN(Date.parse(fecha))) {
            return res.status(400).json({ error: "La fecha no es válida" });
        }
        if (!hora || !/^\d{2}:\d{2}$/.test(hora)) {
            return res.status(400).json({ error: "La hora debe tener formato HH:MM" });
        }

        const query = `
            INSERT INTO citas (id_cliente, id_taller, id_servicio, id_mecanico, fecha, hora, estado, fecha_registro) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [id_cliente, id_taller, id_servicio, id_mecanico, fecha, hora, estadoFinal, fecha_registro];

        db.query(query, values, (error, result) => {
            if (error) {
                console.error("Error al ingresar cita", error);
                return res.status(500).json({ error: "Error al ingresar cita" });
            }
            res.status(201).json({ message: "Cita ingresada correctamente" });
        });
    } catch (err) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Controlador PATCH para editar las citas

const updateCitas = async (req, res) => {
    const { id } = req.params;
    const { id_cliente, id_taller, id_servicio, id_mecanico, fecha, hora, estado } = req.body;

    try {
        const update = [];
        const values = [];

        if (id_cliente) {
            update.push('id_cliente = ?');
            values.push(id_cliente);
        }
        if (id_taller) {
            update.push('id_taller = ?');
            values.push(id_taller);
        }
        if (id_servicio) {
            update.push('id_servicio = ?');
            values.push(id_servicio);
        }
        if (id_mecanico) {
            update.push('id_mecanico = ?');
            values.push(id_mecanico);
        }
        if (fecha) {
            if (isNaN(Date.parse(fecha))) {
                return res.status(400).json({ error: "La fecha no es válida" });
            }
            update.push('fecha = ?');
            values.push(fecha);
        }
        if (hora) {
            if (!/^\d{2}:\d{2}$/.test(hora)) {
                return res.status(400).json({ error: "La hora debe tener formato HH:MM" });
            }
            update.push('hora = ?');
            values.push(hora);
        }
        if (estado) {
            const estadosValidos = ['pendiente', 'confirmado', 'cancelado', 'completada'];
            if (!estadosValidos.includes(estado)) {
                return res.status(400).json({
                    error: "El campo 'estado' solo puede ser 'pendiente', 'confirmado', 'cancelado' o 'completada'"
                });
            }
            update.push('estado = ?');
            values.push(estado);
        }

        if (update.length === 0) {
            return res.status(400).json({ error: "No se proporciono ningun campo para actualizar" });
        }

        const query = `UPDATE citas SET ${update.join(', ')} WHERE id_cita = ?`;
        values.push(id);

        const [result] = await db.promise().query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Cita no encontrada" });
        }
        res.status(200).json({ message: "Cita actualizada correctamente" });
    } catch (err) {
        console.error("Error al actualizar citas", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

//Controlador DELETE para eliminar cita

const deleteCitas = async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM citas WHERE id_citas = ?';
        const [result] = await db.promise().query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Cita no encontrada" });
        }

        res.status(200).json({ message: "Cita eliminada correctamente" });
    } catch (err) {
        console.error("Error al eliminar cita", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = {
    citasSocket,
    addCitas,
    updateCitas,
    deleteCitas
};