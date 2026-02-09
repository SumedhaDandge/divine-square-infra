
import multer from 'multer';

// Use memory storage to process file in buffer immediately
const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.includes("excel") || file.mimetype.includes("spreadsheetml")) {
            cb(null, true);
        } else {
            cb(new Error("Please upload only Excel files."), false);
        }
    }
});

export default upload;
