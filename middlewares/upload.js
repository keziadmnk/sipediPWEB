const multer = require("multer");
const path = require("path");

// Storage config PDF
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/pdf");
  },
  filename: (req, file, cb) => {
    cb(null, "PDF-" + Date.now() + path.extname(file.originalname));
  },
});

// Storage config Sampul
const coverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/sampul");
  },
  filename: (req, file, cb) => {
    cb(null, "SAMPUL-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const isPDF = file.fieldname === "upload_pdf";
      cb(null, isPDF ? "public/uploads/pdf" : "public/uploads/sampul");
    },
    filename: (req, file, cb) => {
      const prefix = file.fieldname === "upload_pdf" ? "PDF" : "SAMPUL";
      cb(null, `${prefix}-${Date.now()}${path.extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
