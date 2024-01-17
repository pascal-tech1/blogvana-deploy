const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

// temp storage
const multerStorage = multer.memoryStorage();

// file checking
const multerFliter = (req, file, cb) => {
	console.log("im her image resize");
	try {
		if (file.mimetype.startsWith("image")) {
			cb(null, true);
		} else {
			cb({ message: "unsupported file format" }, false);
		}
	} catch (error) {}
};

// profile photo upload MiddleWare
const profilePhotoUpload = multer({
	storage: multerStorage,
	fileFilter: multerFliter,
	limits: { fileSize: 10000000 },
});

// profile photo upload MiddleWare
const postImageUpload = multer({
	storage: multerStorage,
	fileFilter: multerFliter,
	limits: { fileSize: 10000000 },
});

// image resizing MiddleWare
const ProfilePhotResize = async (req, res, next) => {
	try {
		if (!req.file) throw new Error("no file to resize");

		if (req.file) {
			const outputBuffer = await sharp(req.file.buffer)
				.resize(20, 20)
				.toFormat("jpeg", { quality: 20 })
				.toBuffer();

			// Convert the buffer to a base64-encoded string
			const base64String = outputBuffer.toString("base64");
			req.blurProfilePhoto = base64String;
		}
		if (req.file) {
			const outputBuffer = await sharp(req.file.buffer).toBuffer();

			// Convert the buffer to a basce64-encoded string
			const base64String = outputBuffer.toString("base64");
			req.photo = base64String;
		}

		next();
	} catch (error) {
		next(error);
	}
};
const postImageResize = async (req, res, next) => {
	try {
		const { file, url } = req;
		console.log(file);
		if (file) {
			const outputBuffer = await sharp(file.buffer)
				.resize(40, 40)
				.toFormat("jpeg", { quality: 50 })
				.toBuffer();

			// Convert the buffer to a base64-encoded string
			const base64String = outputBuffer.toString("base64");
			req.blurImageUrl = base64String;
		}

		if (file) {
			const outputBuffer = await sharp(req.file.buffer).toBuffer();

			// Convert the buffer to a base64-encoded string
			const base64String = outputBuffer.toString("base64");
			req.image = base64String;
		} else if (url && url.startsWith("/update")) {
			// Handle the case where no file is provided but the URL starts with "/update".
			next();
			return;
		} else {
			const error = new Error("No file provided for resizing");
			error.status = 400; // Bad Request
			throw error;
		}
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = {
	profilePhotoUpload,
	ProfilePhotResize,
	postImageResize,
	postImageUpload,
};
