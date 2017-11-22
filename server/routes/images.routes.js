const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const ht = require('../controllers/storage.controller');
const router = express.Router();
const uploadsPath = path.join(__dirname, '../uploads/');
const port = process.env.PORT || 8080;

// Set the storage with multer
const storage = multer.diskStorage({
    // Indicates where you want to save your files
    destination: (req, file, callback) => {
        callback(null, uploadsPath);
    },
    // Indicates how you want your files named
    filename: (req, file, callback) => {
        // Using crypto, generate a random 21 character 
        // string and attach the extension using mime
        crypto.pseudoRandomBytes(21, (err, raw) => {
            if (err) return callback(err);
            callback(null, raw.toString('hex') + Date.now() + path.extname(file.originalname));
        });
    }
});

// Set multer options object
const upload = multer({
    // Where to store the files
    storage: storage,
    // Function to control which files are accepted
    fileFilter: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return callback(new Error('Only images are allowed!'))
        }
        callback(null, true);
    },
    // Limits of the uploaded data
    limits: {
        files: 1,
        fileSize: 1024 * 1024 * 5 // 5MB max file size
    }
}).single('imageToUpload');

router.post('/image', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(422).json({ 'errorMsg': 'The file size can not exceed 5MB!' });
            } else if (err.code === 'LIMIT_FILE_COUNT') {
                return res.status(422).json({ 'errorMsg': 'Too many files!' });
            } else if (err instanceof Error) {
                return res.status(422).json({ 'errorMsg': 'Only images are allowed!' });
            }
        }

        const imgBuffer = fs.readFileSync(uploadsPath + req.file.filename);
        const imgHex = imgBuffer.toString('hex');
        const filePath = `${req.protocol}://${req.hostname}:${port}/api/storage/${req.file.filename}`;

        if (ht.contains(imgHex)) {
            res.json({ 
                message: `This image contains an iris ${ht.getElement(imgHex)}`,
                image: filePath  });
        } else {
            if (req.body.irisType === 'setosa') {
                ht.put(imgHex, 'setosa');
                res.json({ message: 'Thank you for telling me that this picture represents an iris setosa' });
            } else if (req.body.irisType === 'versicolor') {
                ht.put(imgHex, 'versicolor');
                res.json({ message: 'Thank you for telling me that this picture represents an iris versicolor :)' });
            } else if (req.body.irisType === 'virginica') {
                ht.put(imgHex, 'virginica');
                res.json({message: 'Thank you for telling me that this picture represents an iris virginica :)' });
            } else if (!req.body.irisType) {
                res.status(404).json({ message: 'I am sorry but i don\'t know yet what that picture represents :(' });
            }         
        }
    });
});

router.get('/storage/:image', (req, res) => {
    res.sendFile(uploadsPath + req.params.image);
});

module.exports = router;