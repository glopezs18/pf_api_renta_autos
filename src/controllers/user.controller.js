import { getConnection } from "./../database/db";

const getUsers = async (req, res) => {
    try {
        const { id_rol, active } = req.body;
        let filters = "";

        if (id_rol !== undefined) filters = `WHERE id_rol = ${id_rol}`;

        if (active !== undefined) {
            (filters == "") ? filters = "WHERE " : filters += " AND ";
            filters += `active = ${active}`;
        }

        const connection = await getConnection();
        const result = await connection.query(`SELECT id_user, id_rol, name, email, user, password, active, created FROM pf_user ${filters}`);
        res.json({status:200, success: true, response: result});
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query(`SELECT 
            t.id_user,
            t.id_rol,
            r.name AS name_rol,
            t.name,
            t.email,
            t.user,
            t.active,
            t.created
        FROM
            pf_user t INNER JOIN pf_rol r ON t.id_rol = r.id_rol
        WHERE        
            t.id_user = ?
        LIMIT 1;`, id);
        res.json({status:200, success: true, response: result});
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const addUser = async (req, res) => {
    try {
        const { id_rol, name, email, user, password } = req.body;

        if (id_rol === undefined || name === undefined || email === undefined || user === undefined || password === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        // const user_data = { id_rol, name, email, user, password };
        const connection = await getConnection();
        await connection.query(`INSERT INTO pf_user 
            SET 
                id_rol = ${id_rol}, 
                name = '${name}', 
                email = '${email}', 
                user = '${user}', 
                password = MD5('${password}')`);
        res.json({ status: 200, success: true, message: "User added" });
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
        // res.send(error.message);
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_rol, name, email, user, password, active } = req.body;

        if (id === undefined || id_rol === undefined || name === undefined || email === undefined || user === undefined || password === undefined || active === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        
        // const user_data = { id_rol, name, email, user, password, active };
        const connection = await getConnection();
        const result = await connection.query(`UPDATE pf_user 
            SET 
                id_rol = ${id_rol}, 
                name = '${name}', 
                email = '${email}', 
                user = '${user}', 
                password = MD5('${password}'), 
                active = ${active}
            WHERE id_user = ?`, id);
        const response = (result.affectedRows > 0) ? { status: 200, success: true, message: "User Updated" } : { status: 400, success: false, message: "User was not updated" } ;
        res.json(response);
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM pf_user WHERE id_user = ?", id);
        const response = (result.affectedRows > 0) ? { status: 200, success: true, message: "User Deleted" } : { status: 400, success: false, message: "User was not deleted" } ;
        res.json(response);
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { user, password } = req.body;
        const connection = await getConnection();
        const result = await connection.query(`SELECT 
            t.id_user, t.user, t.id_rol
        FROM
            pf_user t
        WHERE
                t.user = ?
                AND t.password = MD5('${password}')
                AND t.active = 1
        LIMIT 1`, user);
        res.json({status:200, success: true, response: result});
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const permissionByIdUser = async (req, res) => {
    try {
        const { id_user } = req.params;

        if (id_user === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }
        // const result = { mesage: "ok" }
        const connection = await getConnection();
        const result = await connection.query(`SELECT 
            r.id_permission_1 AS id_permission,
            r.name_1 AS name,
            r.route_1 AS route,
            r.level_1 AS level,
            r.order_1 AS ordern,
            r.parent_1 AS parent,
            r.icon_1 AS icon,
            CONCAT('[',
                    GROUP_CONCAT('{"id_permission": "',
                        r.id_permission_2,
                        '", ',
                        '"name": "',
                        r.name_2,
                        '", ',
                        '"route": "',
                        r.route_2,
                        '", ',
                        '"level": "',
                        r.level_2,
                        '", ',
                        '"ordern": "',
                        r.order_2,
                        '", ',
                        '"parent": "',
                        r.parent_2,
                        '"',
                        '}'
                        ORDER BY r.order_2),
                    ']') AS level2
        FROM
            (SELECT 
                    p1.id_permission AS id_permission_1,
                    p1.name AS name_1,
                    p1.route AS route_1,
                    p1.level AS level_1,
                    p1.order AS order_1,
                    p1.parent AS parent_1,
                    p1.icon AS icon_1,
                    p2.id_permission AS id_permission_2,
                    p2.name AS name_2,
                    p2.route AS route_2,
                    p2.level AS level_2,
                    p2.order AS order_2,
                    p2.parent AS parent_2
            FROM
                final_project.pf_permission p1
            LEFT JOIN final_project.pf_permission p2 ON p1.id_permission = p2.parent
            WHERE
                p1.level = 1 AND p1.active = 1
                    AND IF(p2.id_permission IS NOT NULL, p2.level = 2 AND p2.active = 1, 1)
                    AND p1.id_permission IN (SELECT 
                        rp.id_permission
                    FROM
                        final_project.pf_user u
                    INNER JOIN final_project.pf_rol_has_permission rp ON u.id_rol = rp.id_rol
                    WHERE
                        u.id_user = 1)
                    AND IF(p2.id_permission IS NOT NULL, p2.id_permission IN (SELECT 
                        rp.id_permission
                    FROM
                        final_project.pf_user u
                    INNER JOIN final_project.pf_rol_has_permission rp ON u.id_rol = rp.id_rol
                    WHERE
                        u.id_user = ?), 1)) r
        GROUP BY id_permission_1
        ORDER BY order_1`, id_user);

        let result_parse = [];
        result.forEach(r => {
            result_parse.push({
                id_permission: r.id_permission,
                name: r.name,
                route: r.route,
                level: r.level,
                order: r.order,
                parent: r.parent,
                icon: r.icon,
                level2: JSON.parse(r.level2)
            })
        });
        // res.json(result_parse);
        res.json({status:200, success: true, response: result_parse});
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const validatePermissionByIuser = async (req, res) => {
    try {
        const { id_user  } = req.params;
        const { id_permission } = req.body;

        if (id_user === undefined || id_permission === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }
        // const result = { mesage: "ok" }
        const connection = await getConnection();
        const result = await connection.query(`SELECT 
            count(*) as permited
        FROM
            pf_user u INNER JOIN pf_rol_has_permission rhp ON u.id_rol = rhp.id_rol
        WHERE 
            u.id_user = ? AND
            rhp.id_permission = ?
        LIMIT 1`, [id_user, id_permission]);
        
        res.json({status:200, success: true, response: result});
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

export const userController = {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser,
    loginUser,
    permissionByIdUser,
    validatePermissionByIuser
};
