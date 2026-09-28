const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E6);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

// File filter - accept images and all video formats
const fileFilter = (req, file, cb) => {
  const isVideo = file.mimetype.startsWith('video/') ||
    file.originalname.match(/\.(mp4|webm|mov|mkv|avi|wmv|flv|m4v|3gp|ogv)$/i);
  const isImage = file.mimetype.startsWith('image/') ||
    file.originalname.match(/\.(jpg|jpeg|png|webp|svg|gif|bmp|ico)$/i);

  if (isVideo || isImage) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype || 'unknown'}. Please upload an image or video file.`), false);
  }
};

// Multer instance with NO size limit (admin can upload any size video)
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: Infinity,  // Unlimited file size
    fieldSize: Infinity, // Unlimited field size
    files: 1
  }
});

exports.uploadMiddleware = (req, res, next) => {
  // Disable socket and request timeouts for large video transfers
  if (req.setTimeout) req.setTimeout(0);
  if (req.socket && req.socket.setTimeout) req.socket.setTimeout(0);

  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('[Upload Error]:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed'
      });
    }
    next();
  });
};

exports.handleUpload = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file was uploaded.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: fileUrl
      }
    });
  } catch (err) {
    console.error('[Upload] Error:', err);
    res.status(500).json({ success: false, message: 'File upload failed.' });
  }
};
