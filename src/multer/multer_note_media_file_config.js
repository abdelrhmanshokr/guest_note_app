// using multer to upload media files in notes 
// multer stores media files locally and a path refering to them will be stored in the database
const multer = require('multer');

// define the dafault file location to save uploaded media files
const multerStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './static/media_files'); 
    },
    filename: function(req, file, cb){
        const fileNameParts = file.mimetype.split('/');
        cb(null, new Date().toISOString() + '-' + file.originalname + '.' + fileNameParts[1]);
    }
});

// create a file filter to filter unwanted file extensions 
const fileFilter = (req, file, cb) => {
    let validMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if(validMimeTypes.indexOf(file.mimetype) != -1){
        // then this file is OK to use
        cb(null, true)
    }else{
        cb(new Error('File is not compatable'), false)
    }
}

const upload_media_files = multer({
    storage: multerStorage,
    fileFilter: fileFilter
});

module.exports = upload_media_files;
