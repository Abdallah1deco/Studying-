const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');

const app = express();
const PORT = 3000;

// إعداد مجلد لحفظ الملفات
const uploadFolder = './uploads';
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

// إعداد multer لرفع الملفات
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

// عرض الملفات المحفوظة
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// رفع ملف PDF
app.post('/upload', upload.single('pdfFile'), (req, res) => {
    res.send(`تم رفع الملف بنجاح: <a href="/uploads/${req.file.filename}">${req.file.filename}</a>`);
});

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// البحث عن نص في ملفات PDF
app.get('/search', (req, res) => {
    const query = req.query.q;
    const results = [];

    fs.readdir(uploadFolder, (err, files) => {
        if (err) return res.status(500).send('خطأ في قراءة الملفات.');

        let remaining = files.length;
        if (remaining === 0) return res.json({ results });

        files.forEach((file) => {
            const filePath = path.join(uploadFolder, file);
            const dataBuffer = fs.readFileSync(filePath);

            pdfParse(dataBuffer)
                .then((data) => {
                    if (data.text.includes(query)) {
                        results.push({ file, filePath });
                    }
                })
                .finally(() => {
                    remaining--;
                    if (remaining === 0) res.json({ results });
                });
        });
    });
});

// بدء الخادم
app.listen(PORT, () => {
    console.log(`الخادم يعمل على http://localhost:${PORT}`);
});