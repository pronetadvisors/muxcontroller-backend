// Multer middleware
import multer from "multer";
import path from "path";

var storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, path.join(__dirname,'/images/'));
	},
	filename: (req, file, callback) => {
		callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});

export var upload = multer({
	storage: storage,
});