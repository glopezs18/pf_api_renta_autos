import { getConnection } from "./../database/db";

const getRoles = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT id_rol, name, description, created FROM pf_rol");
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const getRol = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("SELECT id_rol, name, description, created FROM pf_rol WHERE id_rol = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const addRol = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (name === undefined || description === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const rol = { name, description };
        const connection = await getConnection();
        await connection.query("INSERT INTO pf_rol SET ?", rol);
        res.json({ message: "Rol added" });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const updateRol = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (id === undefined || name === undefined || description === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const rol = { name, description };
        const connection = await getConnection();
        const result = await connection.query("UPDATE pf_rol SET ? WHERE id_rol = ?", [rol, id]);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const deleteRol = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM pf_rol WHERE id_rol = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const rolController = {
    getRoles,
    getRol,
    addRol,
    updateRol,
    deleteRol
};
