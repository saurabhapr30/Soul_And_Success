import path from 'path';
import { env } from '../config/env';

export const uploadsDir = path.resolve(process.cwd(), env.UPLOAD_DIR);
export const optimizedUploadsDir = path.join(uploadsDir, 'optimized');
