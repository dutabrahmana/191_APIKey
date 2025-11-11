// database.js
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Duta123.', // 🔴 VERIFIKASI ULANG PASSWORD INI!
    database: 'api_key'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Gagal terhubung ke MySQL:', err.message);
        // Jika ini error, pastikan MySQL Anda RUNNING
        return;
    }
    console.log('✅ Koneksi MySQL berhasil dibuat dan aktif.');
});

module.exports = db;