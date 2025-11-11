const express = require('express')
const path = require('path')
const crypto = require('crypto')
const db = require('./database') // ✅ Import koneksi database

const app = express()
const port = 3000

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// Test route
app.get('/test', (req, res) => {
    res.send('Hello World!')
})

// ----------------------------------------------------
// ✅ ENDPOINT: GENERATE DAN SIMPAN API KEY BARU
// ----------------------------------------------------
app.post('/create', (req, res) => {
    const { service_name } = req.body

    // Validasi input
    if (!service_name || typeof service_name !== 'string' || service_name.trim() === '') {
        return res.status(400).json({ error: 'Nama Layanan wajib diisi dan berupa teks yang valid.' })
    }

    // Pembuatan API Key (Lebih unik dan mudah dibaca)
    const randomBytes = crypto.randomBytes(16).toString('hex').toUpperCase()
    // Contoh: Hikmatyar-XXXXXXXX-XXXXXXXX-XXXXXXXX
    const apiKey = `duta aja-${randomBytes.slice(0, 8)}-${randomBytes.slice(8, 16)}-${randomBytes.slice(16, 24)}`
    
    // Query INSERT (Memastikan nama tabel 'keys_data' digunakan)
    const sql = 'INSERT INTO keys_data (api_key, service_name) VALUES (?, ?)'
    
    db.query(sql, [apiKey, service_name.trim()], (err, result) => {
        if (err) {
            console.error('❌ Gagal menyimpan API key:', err)
            // MySQL error: misalnya UNIQUE constraint violation, atau tabel tidak ditemukan
            return res.status(500).json({ error: 'Gagal menyimpan ke database. Cek status MySQL dan log server.' })
        }

        console.log('✅ API Key baru disimpan ke database!')
        res.status(200).json({ apiKey, message: 'API Key berhasil dibuat dan disimpan!', service_name: service_name.trim() })
    })
})

// ----------------------------------------------------
// ✅ ENDPOINT: VALIDASI API KEY
// ----------------------------------------------------
app.post('/cekapi', (req, res) => {
    const { api_key } = req.body

    if (!api_key) {
        return res.status(400).json({ error: 'API key wajib dikirim' })
    }

    // Query SELECT (Memastikan nama tabel 'keys_data' digunakan)
    const sql = 'SELECT api_key, service_name, created_at FROM keys_data WHERE api_key = ?'
    db.query(sql, [api_key], (err, results) => {
        if (err) {
            console.error('❌ Error cek API key:', err)
            return res.status(500).json({ error: 'Terjadi kesalahan server saat memvalidasi key.' })
        }

        if (results.length > 0) {
            res.json({ valid: true, service_name: results[0].service_name, created_at: results[0].created_at })
        } else {
            res.json({ valid: false, message: 'API key tidak ditemukan' })
        }
    })
})

// Serve halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(port, () => {
    console.log(`🚀 Server berjalan di http://localhost:${port}`)
})