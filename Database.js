const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',        
  password: 'Duta123.',      
  database: 'apikey_db', 
  port: 3309
});

