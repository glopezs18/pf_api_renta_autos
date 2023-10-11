import { getConnection } from "../database/db";

const getVehicleSummary = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query(`SELECT 
            COUNT(*) AS total_cars,
            SUM(IF(status = 1, 1, 0)) AS total_cars_available,
            SUM(IF(status = 0, 1, 0)) AS total_cars_reserved,
            SUM(IF(status = 2, 1, 0)) AS total_cars_maintenance    
        FROM pf_vehicle`);
        res.json({ status: 200, success: true, response: result });
    } catch(error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
}

const getVehicles = async (req, res) => {
    try {
        const { model, brand, type_vehicle, color, status } = req.body;
        let filters = "";

        if (model !== undefined) filters = `WHERE model = ${model}`;

        if (brand !== undefined) {
            (filters == "") ? filters = "WHERE " : filters += " AND ";
            filters += `brand = '${brand}'`;
        }

        if (type_vehicle !== undefined) {
            (filters == "") ? filters = "WHERE " : filters += " AND ";
            filters += `type_vehicle = ${type_vehicle}`;
        }

        if (color !== undefined) {
            (filters == "") ? filters = "WHERE " : filters += " AND ";
            filters += `color = '${color}'`;
        }

        if (status !== undefined) {
            (filters == "") ? filters = "WHERE " : filters += " AND ";
            filters += `status = ${status}`;
        }

        const connection = await getConnection();
        const result = await connection.query(`SELECT id_vehicle, brand, model, year, type_vehicle, color, plate, milieage, status, image, rental_fee, created FROM pf_vehicle ${filters}`);
        res.json({status:200, success: true, response: result});
        // res.json(filters);
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const getVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query(`SELECT 
            t.id_vehicle,            
            t.brand,
            t.model,            
            t.year,
            t.type_vehicle,
            t.color,
            t.plate,
            t.milieage,
            t.status,
            t.image,
            t.rental_fee,
            t.created
        FROM
            pf_vehicle t
        WHERE        
            t.id_vehicle = ?
        LIMIT 1;`, id);
        res.json({status:200, success: true, response: result});
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const addVehicle = async (req, res) => {
    try {
        const { brand, model, year, type_vehicle, color, plate, milieage, status, image, rental_fee } = req.body;

        if (image === undefined || model === undefined || brand === undefined || year === undefined || type_vehicle === undefined || color === undefined || plate === undefined || milieage === undefined || status === undefined || rental_fee === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const vehicle_data = { model, brand, year, type_vehicle, color, plate, milieage, status, image, rental_fee };
        const connection = await getConnection();
        await connection.query(`INSERT INTO pf_vehicle SET ?`, vehicle_data);
        res.json({ status: 200, success: true, message: "Vehicle added" });
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
        // res.send(error.message);
    }
};

const updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const { model, brand, year, type_vehicle, color, plate, milieage, status, image, rental_fee } = req.body;

        if (image === undefined || model === undefined || brand === undefined || year === undefined || type_vehicle === undefined || color === undefined || plate === undefined || milieage === undefined || status === undefined || rental_fee === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const vehicle_data = { model, brand, year, type_vehicle, color, plate, milieage, status, image, rental_fee };
        const connection = await getConnection();
        const result = await connection.query("UPDATE pf_vehicle SET ? WHERE id_vehicle = ?", [vehicle_data, id]);
        const response = (result.affectedRows > 0) ? { status: 200, success: true, message: "Vehicle Updated" } : { status: 400, success: false, message: "Vehicle was not updated" };
        res.json(response);
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM pf_vehicle WHERE id_vehicle = ?", id);
        res.json({status: 200, success: true, response: result});
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};


export const vehicleController = {
    getVehicleSummary,
    getVehicles,
    getVehicle,
    addVehicle,
    updateVehicle,
    deleteVehicle
};