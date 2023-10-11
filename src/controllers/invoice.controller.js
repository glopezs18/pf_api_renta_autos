import { getConnection } from "./../database/db";

const getInvoiceSummary = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query(`SELECT 
            FORMAT(SUM(total_to_pay), 2) AS total_invoice_sent,
            FORMAT(SUM(IF(status = 1, total_to_pay, 0)), 2) AS total_invoice_paid,
            FORMAT(SUM(IF(status = 0, total_to_pay, 0)), 2) AS total_invoice_unpaid,
            FORMAT(SUM(IF(status = 2, total_to_pay, 0)), 2) AS total_invoice_canceled
        FROM
            pf_billing`);
        res.json({ status: 200, success: true, response: result });
    } catch(error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
}

const getInvoices = async (req, res) => {    
    try {
        const { status, invoice_datetime_created } = req.body;
        let filters = "";

        if (status !== undefined) filters = `WHERE status = ${status}`;

        if (invoice_datetime_created !== undefined) {
            (filters == "") ? filters = "WHERE " : filters += " AND ";
            filters += `DATE(invoice_created) = '${invoice_datetime_created}'`;
        }

        const connection = await getConnection();
        const result = await connection.query(`SELECT 
            b.id_billing,
            c.id_client,
            CONCAT(c.name, ' ', c.lastname) AS client_name,
            CASE
                WHEN b.payment_method = 0 THEN 'Efectivo'
                WHEN b.payment_method = 1 THEN 'Tarjeta de Crédito'
                ELSE 'Depósito'
            END AS payment_method,
            b.invoice_created,
            CASE
                WHEN b.status = 0 THEN 'No pagada'
                WHEN b.status = 1 THEN 'Pagada'
                ELSE 'Cancelada'
            END AS invoice_status,
            FORMAT(b.total_to_pay, 2) AS total_to_pay,
            b.modified
        FROM
            pf_billing b
                INNER JOIN
            pf_rent r ON r.id_rent = b.id_rent
                INNER JOIN
            pf_client c ON c.id_client = r.id_client ${filters}`);
        res.json({ status: 200, success: true, response: result });
        // res.json(filters);
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const getInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query(`SELECT 
            b.id_billing,
            c.id_client,
            CONCAT(c.name, ' ', c.lastname) AS client_name,
            c.address,
            c.nit,
            c.phone,
            c.email,
            CASE
                WHEN b.payment_method = 0 THEN 'Efectivo'
                WHEN b.payment_method = 1 THEN 'Tarjeta de Crédito'
                ELSE 'Depósito'
            END AS payment_method,
            b.invoice_created,
            CASE
                WHEN b.status = 0 THEN 'No pagada'
                WHEN b.status = 1 THEN 'Pagada'
                ELSE 'Cancelada'
            END AS invoice_status,
            FORMAT(r.total_rate, 2) AS total_rate,
            FORMAT((r.total_rate * b.taxes), 2) AS taxes,
            FORMAT(b.total_to_pay, 2) AS total_to_pay,
            b.modified
        FROM
            pf_billing b
                INNER JOIN
            pf_rent r ON r.id_rent = b.id_rent
                INNER JOIN
            pf_client c ON c.id_client = r.id_client
        WHERE b.id_billing = ?
        LIMIT 1;`, id);
        res.json({ status: 200, success: true, response: result });
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const createInvoice = async (req, res) => {
    try {
        const { id_rent, payment_method, total_invoice, rental_details, taxes } = req.body;

        if (id_rent === undefined || payment_method === undefined || total_invoice === undefined || rental_details === undefined || taxes === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const total_to_pay = (total_invoice * taxes) + total_invoice;

        // const rent_data = { id_client, id_vehicle, rental_init_date, rental_end_date, init_milieage, rental_fee, total_rate };
        const connection = await getConnection();
        const response = await connection.query(`INSERT INTO pf_billing(id_rent, payment_method, total_invoice, rental_details, taxes, total_to_pay) VALUES(${id_rent}, ${payment_method}, '${total_invoice}', '${rental_details}', ${taxes}, ${total_to_pay})`);
        const result = (response.affectedRows > 0) ? true : false;

        if (result) {
            res.json({ status: 200, success: true, message: "Invoice created" });
        } else {
            res.json({ status: 400, success: false, message: "Invoice was not created" });
        }
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });        
    }
};

const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const { payment_method, rental_details, status } = req.body;
        
        const data_invoice_update = {payment_method, rental_details, status}
        const connection = await getConnection();
        const result = await connection.query(`UPDATE pf_billing 
            SET 
                payment_method = IFNULL(${payment_method}, payment_method),
                rental_details = IFNULL('${rental_details}', rental_details), 
                status = IFNULL(${status}, status), 
                modified = NOW()
            WHERE id_billing = ?`, id);
            const response = (result.affectedRows > 0) ? { status: 200, success: true, message: "Invoice update" } : { status: 400, success: false, message: "Invoice was not update" };
            res.json(response);
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

const deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM pf_billing WHERE id_billing = ?", id);
        const response = (result.affectedRows > 0) ? { status: 200, success: true, message: "Invoice Deleted" } : { status: 400, success: false, message: "Invoice was not deleted" };
        res.json(response);
    } catch (error) {
        res.status(500);
        res.json({ status: 500, success: false, message: error.message });
    }
};

export const invoiceController = {
    getInvoiceSummary,
    getInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice
};
