import { getConnection } from "./../database/db";

const getClients = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT id_client, name, lastname, dpi, address, email, phone, nit, created FROM pf_client");
        res.json({status:200, success: true, response: result});
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const getClient = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("SELECT id_client, name, lastname, dpi, address, email, phone, nit, created FROM pf_client WHERE id_client = ?", id);
        res.json({status:200, success: true, response: result});
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const addClient = async (req, res) => {
    try {
        const { name, lastname, dpi, address, email, phone, nit } = req.body;

        if (name === undefined || lastname === undefined || dpi === undefined || address === undefined || email === undefined || phone === undefined || nit === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const client = { name, lastname, dpi, address, email, phone, nit };
        const connection = await getConnection();
        await connection.query("INSERT INTO pf_client SET ?", client);        
        res.json({ status: 200, success: true, message: "Client added" });
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, lastname, dpi, address, email, phone, nit } = req.body;

        if (id === undefined || name === undefined || lastname === undefined || dpi === undefined || address === undefined || email === undefined || phone === undefined || nit === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const client = { name, lastname, dpi, address, email, phone, nit };
        const connection = await getConnection();
        const result = await connection.query("UPDATE pf_client SET ? WHERE id_client = ?", [client, id]);
        const response = (result.affectedRows > 0) ? { status: 200, success: true, message: "Client Updated" } : { status: 400, success: false, message: "Client was not updated" } ;
        res.json(response);        
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM pf_client WHERE id_client = ?", id);
        const response = (result.affectedRows > 0) ? { status: 200, success: true, message: "Client Deleted" } : { status: 400, success: false, message: "Client was not deleted" } ;
        res.json(response);
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

export const clientController = {
    getClients,
    getClient,
    addClient,
    updateClient,
    deleteClient
};
