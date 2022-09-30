import multer from 'multer';
import {Request} from "express";

const storageEngine = multer.diskStorage ({});

const fileFilter = (_req: Request, file: any, callback: any) => {

	if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
		// upload only png and jpg format
		return callback(new Error('Please upload a Image'))
	}
	callback(undefined, true)
};

const upload = multer ({
	storage: storageEngine,
	fileFilter
});

export default upload;
