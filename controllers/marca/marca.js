const db = require('../../config/db');

//Controlador Socket para mostrar todas las marcas

const marcaSocket = async(socket) => {
    const query = 'SELECT * FROM marca';
    try{
        const [rows] = await db.promise().query(query);

        if(!rows || rows.length === 0){
            return socket.emit('error', { message: "No se encontro ninguna marca"});
        }
        socket.emit('marca', rows);
    }catch(err){
        console.error("Erro al obtener las marcas", err);
        socket.emmi("error", { message: "Error al obtener marcas"});
    }
};

//Controlador POST para agregar marcas

const addMarca = async (req, res) => {
    const { marca } = req.body;
    const fecha_registro = new Date();

    try{
        const query = 'INSERT INTO marca (marca, fecha_registro) VALUES (?, ?)';
        const values = [marca, fecha_registro];

        db.query(query, values, (error, result) => {
            if(error){
                console.error("Error al ingresar una marca");
                return res.status(500).json({error: "Error al ingresar una marca"});
            }
            res.status(200).json({ message: "Marca ingresada correctamente"})
        });
    }catch(err){
        res.status(500).json({ error: "Error interno del servidor" })
    }
};

//Controlador DELETE para eliminar marca

const deleteMarca = async (req, res) => {
    const {id} = req.params;
    const query = 'DELETE FROM marca WHERE id_marca = ?';
    const values = [id];

    id.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar marca", error);
            return res.status(500).json({ error: "Error al eliminar marca"});
        }else{
            res.status(201).json({message: "Marca eliminada correctamente"});
        }
    });
}

module.exports = {
    marcaSocket,
    addMarca,
    deleteMarca
};