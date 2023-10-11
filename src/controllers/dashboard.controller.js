import { getConnection } from "./../database/db";

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
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const getInvoiceSummary = async (req, res) => {
    try {
        const result = [];
        const connection = await getConnection();
        const data_revenue = await connection.query(`SELECT FORMAT(SUM(total_to_pay), 2) AS total_revenue FROM pf_billing WHERE MONTH(invoice_created) = MONTH(CURDATE())`);
        const data_total_orders = await connection.query(`SELECT COUNT(*) AS total_invoice  FROM pf_billing`);
        const data_orders_current_month = await connection.query(`SELECT DATE(invoice_created) AS invoice_created, COUNT(*) AS total_invoice FROM pf_billing WHERE MONTH(invoice_created) = MONTH(CURDATE()) GROUP BY DATE(invoice_created)`);

        result.push({
            revenue: data_revenue[0].total_revenue,
            total_orders: data_total_orders[0].total_invoice,
            orders_current_month: data_orders_current_month
        });
        res.json({ status: 200, success: true, response: result });
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const getRentSummary = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query(`SELECT 
            t.id_rent,
            t.id_client,
            CONCAT(c.name, ' ', c.lastname) AS client_name,
            t.id_vehicle,
            v.brand AS vehicle_brand,
            v.model AS vehicle_model,
            DATE(t.rental_init_date) AS rental_init_date,
            DATE(t.rental_end_date) AS rental_end_date,
            CASE
                WHEN t.rental_status = 0 THEN 'Creado'
                WHEN t.rental_status = 1 THEN 'En Curso'
                WHEN t.rental_status = 2 THEN 'Finalizado'
                ELSE 'Cancelado'
            END AS rental_status,
            t.created
        FROM
            pf_rent t
                INNER JOIN
            pf_client c ON c.id_client = t.id_client
                INNER JOIN
            pf_vehicle v ON v.id_vehicle = t.id_vehicle
        ORDER BY t.created DESC`);
        res.json({ status: 200, success: true, response: result });
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const getRentSummaryByStatus = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query(`SELECT 
            CASE
                WHEN rental_status = 0 THEN 'Creado'
                WHEN rental_status = 1 THEN 'En Curso'
                WHEN rental_status = 2 THEN 'Finalizado'
                ELSE 'Cancelado'
            END AS rental_status,
            COUNT(*) AS total_rents
        FROM
            pf_rent
        GROUP BY rental_status`);
        res.json({ status: 200, success: true, response: result });
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

export const dashboardController = {
    getVehicleSummary,
    getInvoiceSummary,
    getRentSummary,
    getRentSummaryByStatus
};