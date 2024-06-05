const fs = require('fs');
const cron = require('node-cron');
const chalk = require('chalk');
const moment = require('moment');
const queries = require('./query');

let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mouaka'
});

console.log(chalk.blue('-------------------------------------------------------------'));
console.log(chalk.bgBlue(`CRON BERJALAN SETIAP HARI PADA JAM  11:59 | 23:59 `));
console.log(chalk.blue('-------------------------------------------------------------'));
// Mendapatkan tanggal hari ini dalam format yang sesuai dengan format tanggal di database
const todayDate = moment().format('YYYY-MM-DD');

cron.schedule('59 08 * * *', function () {
    // STARTTING CONNECTION TO THE DATABASE
    connection.connect(function (err) {
        if (err) throw err;
        console.log(chalk.bgGreen('----------------------DATABASE START / CONNECTED-------------------------\n'));
    });

    setTimeout(() => {
        // Menjalankan fungsi untuk mengupdate status dokumen MOU
        UpdateMou();
    }, 2000);
    setTimeout(() => {
        console.log('\n');
        // Menjalankan fungsi untuk mengupdate status dokumen MOA
        UpdateMoa();
    }, 4000);

    //setTimeout
    setTimeout(() => {
        connection.end();
        console.log(chalk.bgRed('\n----------------------DATABASE END / DISCONNECTED-------------------------'));
    }, 6000);


});

// LIST FUNCTION
// Function untuk mengupdate status dokumen MOU
function UpdateMou() {
    const data_mou = queries.select_mou;
    connection.query(data_mou, [todayDate], function (error, results, fields) {
        if (error) throw error;
        let data_content_mou = [];

        results.forEach(row => {
            const nomor_mou = row.nomor_mou;
            const tanggal_berakhir = row.tanggal_berakhir;

            data_content_mou.push({
                nomor_dokumen: nomor_mou,
                tanggal_berakhir: tanggal_berakhir
            });
        });

        if (results.length > 0) {
            const update_mou = queries.update_mou;
            // Eksekusi perintah UPDATE untuk mengubah status
            connection.query(update_mou, ['TIDAK AKTIF', todayDate], function (error, updateResult) {
                if (error) throw error;
                console.log(`Total dokumen mou yang statusnya diperbarui: ${updateResult.affectedRows}`);
                // Insert ke Log_user
                const insert_data_log_user = queries.insert_data_log_user;
                connection.query(insert_data_log_user, [JSON.stringify(data_content_mou), 'scheduller', 'UPDATE STATUS MOU ', new Date()], function (error, insertResult) {
                    if (error) throw error;
                    let pesan = `Update status berhasil, dokumen MOU yang diperbarui: ${updateResult.affectedRows}, pada tanggal ${todayDate}`
                    console.log(`Log user berhasil ditambahkan dengan id: ${insertResult.insertId}`);
                    LogPesan(pesan);
                });
            });
        } else {
            console.log('Tidak ada dokumen mou yang perlu diperbarui statusnya.');
        }
    });
}
// Function untuk mengupdate status dokumen MOA
function UpdateMoa() {
    const data_moa = queries.select_moa;
    connection.query(data_moa, [todayDate], function (error, results, fields) {
        if (error) throw error;
        let data_content_moa = [];

        results.forEach(row => {
            const nomor_moa = row.nomor_moa;
            const tanggal_berakhir = row.tanggal_berakhir;

            data_content_moa.push({
                nomor_dokumen: nomor_moa,
                tanggal_berakhir: tanggal_berakhir
            });
        });

        if (results.length > 0) {
            const update_moa = queries.update_moa;
            // Eksekusi perintah UPDATE untuk mengubah status
            connection.query(update_moa, ['TIDAK AKTIF', todayDate], function (error, updateResult) {
                if (error) throw error;
                console.log(`Total dokumen moa yang statusnya diperbarui: ${updateResult.affectedRows}`);
                // Insert ke Log_user
                const insert_data_log_user = queries.insert_data_log_user;
                connection.query(insert_data_log_user, [JSON.stringify(data_content_moa), 'scheduller', 'UPDATE STATUS MOA ', new Date()], function (error, insertResult) {
                    if (error) throw error;
                    let pesan = `Update status berhasil, dokumen MOA yang diperbarui: ${updateResult.affectedRows}, pada tanggal ${todayDate}`
                    console.log(`Log user berhasil ditambahkan dengan id: ${insertResult.insertId}`);
                    LogPesan(pesan);
                });
            });
        } else {
            console.log('Tidak ada dokumen moa yang perlu diperbarui statusnya.');
        }
    });
}
function LogPesan(data) {
    // Mengecek apakah file log.txt ada
    fs.access('log.txt', fs.constants.F_OK, (err) => {
        if (err) {
            // Jika file tidak ada, buat file baru
            fs.writeFile('log.txt', '', (err) => {
                if (err) {
                    console.error('Gagal membuat file log.txt:', err);
                    return;
                }
                console.log('File log.txt berhasil dibuat.');
                tambahPesanLog(data);
            });
        } else {
            // Jika file sudah ada, tambahkan pesan log
            tambahPesanLog(data);
        }
    });
}
function tambahPesanLog(data) {
    // Membaca jumlah baris dalam file log.txt
    fs.readFile('log.txt', 'utf8', (err, content) => {
        if (err) {
            console.error(err);
            return;
        }

        // Menghitung jumlah baris
        const jumlahBaris = content.trim().split('\n').length;

        // Menambahkan satu untuk mendapatkan nomor urutan baru
        const nomorBaru = jumlahBaris + 1;

        // Membuat data dengan nomor urutan baru
        const dataWithNumber = `${nomorBaru}: ${data}\n`;

        // Menyimpan data ke dalam file log.txt
        fs.appendFile('log.txt', dataWithNumber, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Log berhasil disimpan ke dalam file.');
            }
        });
    });
}
