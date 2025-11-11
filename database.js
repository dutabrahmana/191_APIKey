const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // ganti kalau user MySQL kamu beda
  password: 'Duta123.',        // isi password MySQL kamu
  database: 'apikey_db', // ✅ sesuai database kamu
  port: 3309
});

db.connect((err) => {
  if (err) {
    console.error('❌ Gagal konek ke database:', err);
  } else {
    console.log('✅ Terhubung ke database MySQL apikey_db!');
  }
});

module.exports = db;
