
// query.js
const queries = {
    // GET_DATA
    select_mou: `SELECT * FROM dokumen_mou WHERE tanggal_berakhir < ? AND status = 'AKTIF'`,
    select_moa: `SELECT * FROM dokumen_moa WHERE tanggal_berakhir < ? AND status = 'AKTIF'`,
    // UPDATE DATA
    update_mou: `UPDATE dokumen_mou SET status = ? WHERE tanggal_berakhir < ?`,
    update_moa: `UPDATE dokumen_moa SET status = ? WHERE tanggal_berakhir < ?`,
    // INSERT DATA
    insert_data_log_user: `INSERT INTO log_user (content,nama_username,action,created_at) VALUES (?,?,?,?)`,
};

module.exports = queries;