import { getConnection } from "./../database/db";

const getRents = async (req, res) => {
    try {
        const { status, rental_datetime_init, rental_datetime_end, rental_datetime_created } = req.body;
        let filters = "";

        if (status !== undefined) filters = `WHERE rental_status = ${status}`;

        if (rental_datetime_init !== undefined) {
            (filters == "") ? filters = "WHERE " : filters += " AND ";
            filters += `DATE(rental_init_date) >= '${rental_datetime_init}'`;
        }

        if (rental_datetime_end !== undefined) {
            (filters == "") ? filters = "WHERE " : filters += " AND ";
            filters += `DATE(rental_end_date) <= '${rental_datetime_end}'`;
        }

        if (rental_datetime_created !== undefined) {
            (filters == "") ? filters = "WHERE " : filters += " AND ";
            filters += `DATE(created) = '${rental_datetime_created}'`;
        }

        const connection = await getConnection();
        const result = await connection.query(`SELECT 
            t.id_rent,
            t.id_client,    
            CONCAT(c.name, ' ',c.lastname) AS client_name,
            t.id_vehicle,
            CONCAT(v.brand, ' - ',v.model) AS vehicle,
            t.rental_init_date,
            t.rental_end_date,
            t.init_milieage,
            t.end_milieage,
            t.total_rate,
            CASE
                WHEN t.rental_status = 0 THEN 'Creado'
                WHEN t.rental_status = 1 THEN 'En Curso'
                WHEN t.rental_status = 2 THEN 'Finalizado'
                ELSE 'Cancelado'
            END AS rental_status,
            t.created,
            t.modified
        FROM
            pf_rent t
                INNER JOIN pf_client c ON c.id_client = t.id_client
                INNER JOIN pf_vehicle v ON v.id_vehicle = t.id_vehicle ${filters}`);
        res.json({ status: 200, success: true, response: result });
        // res.json(filters);
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const getRent = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query(`SELECT 
            t.id_rent,
            t.id_client,    
            CONCAT(c.name, ' ',c.lastname) AS client_name,
            t.id_vehicle,
            CONCAT(v.brand, ' - ',v.model) AS vehicle,
            t.rental_init_date,
            t.rental_end_date,
            t.init_milieage,
            t.end_milieage,
            t.total_rate,
            CASE
                WHEN t.rental_status = 0 THEN 'Creado'
                WHEN t.rental_status = 1 THEN 'En Curso'
                WHEN t.rental_status = 2 THEN 'Finalizado'
                ELSE 'Cancelado'
            END AS rental_status,
            t.created,
            t.modified
        FROM
            pf_rent t
                INNER JOIN pf_client c ON c.id_client = t.id_client
                INNER JOIN pf_vehicle v ON v.id_vehicle = t.id_vehicle
        WHERE
            t.id_rent = ?
        LIMIT 1;`, id);
        res.json({ status: 200, success: true, response: result });
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const createRent = async (req, res) => {
    try {
        const { id_client, id_vehicle, rental_init_date, rental_end_date, init_milieage, rental_fee } = req.body;

        if (id_client === undefined || id_vehicle === undefined || rental_init_date === undefined || rental_end_date === undefined || init_milieage === undefined || rental_fee === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }


        let diff_days = (new Date(rental_end_date).getTime()) - (new Date(rental_init_date).getTime());
        diff_days = diff_days / (1000 * 60 * 60 * 24)
        const total_rate = (diff_days * rental_fee)
        // const rent_data = { id_client, id_vehicle, rental_init_date, rental_end_date, init_milieage, rental_fee, total_rate };
        const connection = await getConnection();
        const response = await connection.query(`INSERT INTO pf_rent(id_client, id_vehicle, rental_init_date, rental_end_date, init_milieage, total_rate) VALUES(${id_client}, ${id_vehicle}, '${rental_init_date}', '${rental_end_date}', ${init_milieage}, ${total_rate})`);
        const result = (response.affectedRows > 0) ? true : false;

        if (result) {
            const connection = await getConnection();
            const result_vehicle = await connection.query(`UPDATE pf_vehicle SET status = 0 WHERE id_vehicle = ?`, id_vehicle);
            const response_vehicle = (result_vehicle.affectedRows > 0) ? { status: 200, success: true, message: "Rent created" } : { status: 400, success: false, message: "Rent was not created" };
            res.json(response_vehicle);
        } else {
            res.json({ status: 400, success: false, message: "Rent was not created" });
        }
        // res.json({ status: 200, success: true, message: "Rent added" });
        // res.json(result);
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
        // res.send(error.message);
    }
};

const updateRent = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_vehicle, end_milieage, rental_status } = req.body;

        // if (id === undefined || id_rol === undefined || name === undefined || email === undefined || user === undefined || password === undefined || active === undefined) {
        //     res.status(400).json({ message: "Bad Request. Please fill all field." });
        // }

        const milieage_vehicle = (rental_status == 2) ? end_milieage : null;            
        const connection = await getConnection();
        const result = await connection.query(`UPDATE pf_rent 
            SET 
                end_milieage = IFNULL(${milieage_vehicle}, end_milieage), 
                rental_status = IFNULL(${rental_status}, rental_status), 
                modified = NOW()
            WHERE id_rent = ?`, id);

        const validate_result = (result.affectedRows > 0) ? true : false;

        if ((rental_status == 2 && milieage_vehicle != null && validate_result) || (rental_status == 3 && validate_result)) {
            const connection = await getConnection();
            const result_vehicle = await connection.query(`UPDATE pf_vehicle SET milieage = IFNULL(${milieage_vehicle}, milieage), status = 1 WHERE id_vehicle = ?`, id_vehicle);
            const response_vehicle = (result_vehicle.affectedRows > 0) ? { status: 200, success: true, message: "Rent update" } : { status: 400, success: false, message: "Rent was not update" };
            res.json(response_vehicle);
        }
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const deleteRent = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM pf_rent WHERE id_rent = ?", id);
        const response = (result.affectedRows > 0) ? { status: 200, success: true, message: "Rent Deleted" } : { status: 400, success: false, message: "Rent was not deleted" };
        res.json(response);
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

export const rentController = {
    getRents,
    getRent,
    createRent,
    updateRent,
    deleteRent
};
