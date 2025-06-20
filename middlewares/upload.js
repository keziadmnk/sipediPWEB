const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Buat folder jika belum ada
const createUploadDirs = () => {
  const dirs = [
    'public/uploads/pdf',
    'public/uploads/covers',
    'public/uploads/profil'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Panggil fungsi untuk membuat folder
createUploadDirs();

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "upload_pdf") {
      cb(null, "public/uploads/pdf");
    } else if (file.fieldname === "upload_sampul") {
      cb(null, "public/uploads/covers");
    } else if (file.fieldname === "foto") {
      cb(null, "public/uploads/profil");
    } else {
      cb(new Error("Field name tidak valid"), null);
    }
  },
  filename: (req, file, cb) => {
    let prefix = "";
    if (file.fieldname === "upload_pdf") {
      prefix = "PDF";
    } else if (file.fieldname === "upload_sampul") {
      prefix = "SAMPUL";
    } else if (file.fieldname === "foto") {
        prefix = "FOTO";
    }
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "upload_pdf") {
    // Hanya terima file PDF
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Hanya file PDF yang diperbolehkan untuk upload PDF!"), false);
    }
  } else if (file.fieldname === "upload_sampul") {
    // Hanya terima file gambar (PNG, JPG, JPEG)
    if (file.mimetype === "image/png" || 
        file.mimetype === "image/jpeg" || 
        file.mimetype === "image/jpg") {
      cb(null, true);
    } else {
      cb(new Error("Hanya file PNG, JPG, atau JPEG yang diperbolehkan untuk upload sampul!"), false);
    }
  } else if (file.fieldname === "foto") {
    // Hanya terima file gambar untuk foto profil
    if (file.mimetype === "image/png" || 
        file.mimetype === "image/jpeg" || 
        file.mimetype === "image/jpg") {
      cb(null, true);
    } else {
      cb(new Error("Hanya file PNG, JPG, atau JPEG yang diperbolehkan untuk foto profil!"), false);
    }
  } else {
    cb(new Error("Field name tidak valid"), false);
  }
};

// Upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 2 // maksimal 2 file (PDF + sampul)
  },
});

// Export upload middleware
module.exports = {
  // Untuk multiple fields
  uploadFields: upload.fields([
    { name: "upload_pdf", maxCount: 1 },
    { name: "upload_sampul", maxCount: 1 },
  ]),
  
  // Untuk single file jika diperlukan
  uploadSingle: (fieldName) => {
    return multer({
      storage: storage,
      fileFilter: fileFilter,
      limits: { 
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }).single(fieldName);
  },
  
  // Export upload object jika diperlukan
  upload: upload
};