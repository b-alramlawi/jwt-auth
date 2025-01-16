// fileUpload.js

const fs = require('fs');
const multer = require('multer');
const path = require('path');

const generateRandomNumber = () => {
    return Math.floor(Math.random() * 9999) + 1;
};

const removeOldFile = (oldFilename) => {
    if (oldFilename && fs.existsSync(oldFilename)) {
        fs.unlinkSync(oldFilename);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.params.userId;
        const uploadPath = `uploads/${userId}/profile-picture`;

        fs.mkdirSync(uploadPath, {recursive: true});

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const randomNumber = generateRandomNumber();
        const ext = path.extname(file.originalname);
        const filename = `${file.originalname.split('.')[0]}_${randomNumber}${ext}`;
        cb(null, filename);
    },
});

const upload = multer({storage: storage}).single('avatar');

module.exports = {
    upload,
    removeOldFile,
};
