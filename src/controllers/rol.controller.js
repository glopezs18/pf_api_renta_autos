import { getConnection } from "./../database/db";

const getRoles = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT id_rol, name, description, created FROM pf_rol");
        
        res.json({status: 200, success: true, response: result});
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const getRol = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("SELECT id_rol, name, description, created FROM pf_rol WHERE id_rol = ?", id);
        
        res.json({status: 200, success: true, response: result});
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
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
        
        res.json({ status: 200, success: true, message: "Rol added" });
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
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
        res.json({status: 200, success: true, response: result});
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const deleteRol = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM pf_rol WHERE id_rol = ?", id);
        res.json({status: 200, success: true, response: result});
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const readLevel1ByIdRol = async (req, res) => {
    try {
        const { id_rol } = req.params;

        if (id_rol === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const connection = await getConnection();
        const result = await connection.query(`SELECT 
            p1.id_permission AS id,
            p1.name,
            p1.order,
            p1.icon,
            IF(p1.id_permission = rhp.id_permission, 1, 0) AS active
        FROM 
            pf_permission p1
            LEFT JOIN pf_rol_has_permission rhp ON p1.id_permission = rhp.id_permission AND rhp.id_rol = ?
        WHERE 
            p1.level = 1 AND p1.active = 1
        ORDER BY p1.order`, id_rol);
        
        res.json({status: 200, success: true, response: result});
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const readLevel2ByIdRolAndIdPermission = async (req, res) => {
    try {
        const { id_rol } = req.params;
        const { id_permission } = req.body;

        if (id_rol === undefined || id_permission === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const connection = await getConnection();
        const result = await connection.query(`SELECT 
            p2.id_permission AS id,
            p2.name,
            p2.order,
            p2.icon,
            IF(p2.id_permission = rhp.id_permission, 1, 0) AS active
        FROM 
            pf_permission p2
            LEFT JOIN pf_rol_has_permission rhp ON p2.id_permission = rhp.id_permission AND rhp.id_rol = ?
        WHERE 
            p2.level = 2 AND p2.active = 1 AND p2.parent = ?
        ORDER BY p2.order`, [id_rol, id_permission]);
        
        res.json({status: 200, success: true, response: result});
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const deletePermissionForIdRol = async (req, res) => {
    try {
        const { id_rol } = req.params;
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM pf_rol_has_permission WHERE id_rol = ?", id_rol);
        res.json({status: 200, success: true, response: result});
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const createPermissionForIdRol = async (req, res) => {
    try {
        const { id_rol, id_permission } = req.body;

        if (id_rol === undefined || id_permission === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        // const rol_has_permission = { id_rol, id_permission };
        const connection = await getConnection();
        await connection.query(`INSERT INTO pf_rol_has_permission (id_rol, id_permission) VALUES(${id_rol}, '${id_permission}')`);
        
        res.json({ status: 200, success: true, message: "Rol Has Permission added" });
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

export const rolController = {
    getRoles,
    getRol,
    addRol,
    updateRol,
    deleteRol,
    readLevel1ByIdRol,
    readLevel2ByIdRolAndIdPermission,
    deletePermissionForIdRol,
    createPermissionForIdRol
};
