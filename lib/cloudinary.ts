import { v2 as cloudinary } from 'cloudinary';

if (!process.env.CLOUDINARY_URL) {
  throw new Error('CLOUDINARY_URL is not set');
}

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
  secure: true
});

export default cloudinary;