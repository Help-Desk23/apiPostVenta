const db = require('../../config/db');

//Controlador Socket para mostrar ID de los talleres y servicios

const tallerServSocket = async (socket) => {
    const query = 'SELECT * FROM taller_servicios';
    
    try{
        const [rows] = await db.promise().query(query);

        if(!rows || rows === 0){
            return socket.emit('error', {message: "No se encontro id de los talleres y servicios"});
        }
        socket.emit('tallerServicios', rows);
    }catch(err){
        console.error("Error al obtener id de los talleres y servicios");
        socket.emit('error', {message: "Error al obtener id de los talleres y servicios"});
    }
};

//Controlador POST para agregar ID de talleres y servicios

const addTallerServ = async (req, res) => {
    const { id_taller, id_servicio } = req.body;

    try {
        const query = 'INSERT INTO taller_servicios (id_taller, id_servicio) VALUES (?, ?)';
        const values = [id_taller, id_servicio];

        db.query(query, values, (error, result) => {
            if (error) {
                if (error.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({ error: "Ese servicio ya está asignado a este taller" });
                }
                console.error("Error al ingresar id de talleres y servicios", error);
                return res.status(500).json({ error: "Error al ingresar id de talleres y servicios" });
            }
            res.status(201).json({ 
                message: "Id de taller y servicio ingresado correctamente",
                data: { id_taller, id_servicio }
            });
        });
    } catch (err) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};



module.exports = {
    tallerServSocket,
    addTallerServ
};