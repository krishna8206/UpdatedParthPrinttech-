const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary if environment variables are provided
const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
  );
};

if (process.env.CLOUDINARY_URL) {
  cloudinary.config();
} else if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Ensure uploads folder exists locally
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

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: Infinity,
    fieldSize: Infinity,
    files: 1
  }
});

exports.uploadMiddleware = (req, res, next) => {
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

exports.handleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file was uploaded.' });
    }

    const localFilePath = req.file.path;
    let fileUrl = `/uploads/${req.file.filename}`;

    // Also sync to frontend public uploads if running locally and folder exists
    const frontendPublicUploads = path.join(__dirname, '../../../frontend-parth_printtech/public/uploads');
    try {
      if (fs.existsSync(frontendPublicUploads)) {
        fs.copyFileSync(localFilePath, path.join(frontendPublicUploads, req.file.filename));
      }
    } catch (e) {
      // Non-fatal if frontend path isn't local
    }

    // If Cloudinary is configured, upload to Cloudinary for permanent storage
    if (isCloudinaryConfigured()) {
      try {
        const isVideo = req.file.mimetype.startsWith('video/') ||
          req.file.originalname.match(/\.(mp4|webm|mov|mkv|avi|wmv|flv|m4v|3gp|ogv)$/i);

        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
          resource_type: isVideo ? 'video' : 'auto',
          folder: 'parth_printtech',
          use_filename: true,
          unique_filename: true
        });

        if (uploadResult && uploadResult.secure_url) {
          fileUrl = uploadResult.secure_url;
          console.log('[Cloudinary] Successfully uploaded to cloud:', fileUrl);
        }
      } catch (cloudErr) {
        console.error('[Cloudinary Upload Error, falling back to local]:', cloudErr);
      }
    } else {
      console.log('[Upload] Cloudinary not configured. File stored locally at:', fileUrl);
    }

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

