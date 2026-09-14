import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { NotFoundError } from './utils/errors';

import userRoutes from './routes/userRoutes';
import addressRoutes from './routes/addressRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import reviewRoutes from './routes/reviewRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import couponRoutes from './routes/couponRoutes';
import blogPostRoutes from './routes/blogPostRoutes';
import courseRoutes from './routes/courseRoutes';
import serviceRoutes from './routes/serviceRoutes';
import bookRoutes from './routes/bookRoutes';
import contactMessageRoutes from './routes/contactMessageRoutes';
import newsletterSubscriberRoutes from './routes/newsletterSubscriberRoutes';
import promotionRoutes from './routes/promotionRoutes';
import siteSettingsRoutes from './routes/siteSettingsRoutes';
import authRoutes from './routes/authRoutes';
import paymentRoutes from './routes/paymentRoutes';
import uploadRoutes from './routes/uploadRoutes';
import testimonialRoutes from './routes/testimonialRoutes';

const app = express();
app.set('trust proxy', 1);

// 1) GLOBAL MIDDLEWARES
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

const isAllowedOrigin = (origin: string): boolean => {
  // Always allow configured client URL
  if (env.CLIENT_URL && origin === env.CLIENT_URL) {
    return true;
  }

  // In development, allow localhost, 127.0.0.1, Cloudflare tunnels, and ngrok
  if (env.NODE_ENV !== 'production') {
    const allowedLocal = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5174',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ];
    if (allowedLocal.includes(origin)) return true;

    // Match any valid Cloudflare quick tunnel (https://<random-subdomain>.trycloudflare.com)
    if (/^https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com$/.test(origin)) return true;

    // Match ngrok dev tunnels
    if (origin.endsWith('.ngrok-free.dev') || origin.endsWith('.ngrok.io') || origin.endsWith('.ngrok-free.app')) {
      return true;
    }
  }

  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    optionsSuccessStatus: 200,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in 15 minutes!',
});
app.use('/api', limiter);

// Serve uploads folder with  caching headers and intelligent variant fallback
app.use('/uploads/optimized', (req: Request, res: Response, next: NextFunction) => {
  const optimizedDir = path.join(process.cwd(), 'uploads', 'optimized');
  const uploadsDir = path.join(process.cwd(), 'uploads');
  const filePath = path.join(optimizedDir, req.path);

  // 1. Direct file match
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.sendFile(filePath);
  }

  const parsed = path.parse(req.path);
  const widthMatch = parsed.name.match(/-(?:400|800|1200|1600|1920)$/);
  const baseName = widthMatch ? parsed.name.replace(/-(?:400|800|1200|1600|1920)$/, '') : parsed.name;

  // 2. Master WebP file: ${baseName}.webp
  const masterWebpPath = path.join(optimizedDir, `${baseName}.webp`);
  if (fs.existsSync(masterWebpPath) && fs.statSync(masterWebpPath).isFile()) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.sendFile(masterWebpPath);
  }

  // 3. Intelligent prefix search in optimized directory (handles truncated or legacy URLs)
  if (fs.existsSync(optimizedDir)) {
    const optFiles = fs.readdirSync(optimizedDir);
    const prefix = parsed.name.replace(/-\d+$/, '');
    const widthSuffix = widthMatch ? widthMatch[0] : '';

    if (widthSuffix) {
      const variantMatch = optFiles.find(
        (f) => f.startsWith(`${prefix}-`) && f.endsWith(`${widthSuffix}.webp`)
      );
      if (variantMatch) {
        const variantPath = path.join(optimizedDir, variantMatch);
        if (fs.statSync(variantPath).isFile()) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          return res.sendFile(variantPath);
        }
      }
    }

    const masterMatch = optFiles.find(
      (f) => (f.startsWith(`${prefix}-`) || f.startsWith(`${baseName}-`)) && !f.match(/-(?:400|800|1200|1600|1920)\.webp$/) && f.endsWith('.webp')
    ) || optFiles.find((f) => f.startsWith(prefix) && f.endsWith('.webp'));

    if (masterMatch) {
      const matchedPath = path.join(optimizedDir, masterMatch);
      if (fs.statSync(matchedPath).isFile()) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return res.sendFile(matchedPath);
      }
    }
  }

  // 4. Fallback to original uploaded file if any exists
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    const prefix = parsed.name.replace(/-\d+$/, '');
    const originalFile = files.find(
      (f) => path.parse(f).name === baseName || path.parse(f).name.startsWith(`${prefix}-`) || path.parse(f).name.startsWith(prefix)
    );
    if (originalFile) {
      const origPath = path.join(uploadsDir, originalFile);
      if (fs.statSync(origPath).isFile()) {
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.sendFile(origPath);
      }
    }
  }

  next();
});

app.use(
  '/uploads',
  express.static(path.join(process.cwd(), 'uploads'), {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      if (filePath.includes('optimized')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
    },
  })
);

// 2) ROUTES
app.use('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    database: 'connected'
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/addresses', addressRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/blog', blogPostRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/contact', contactMessageRoutes);
app.use('/api/v1/newsletter', newsletterSubscriberRoutes);
app.use('/api/v1/promotions', promotionRoutes);
app.use('/api/v1/settings', siteSettingsRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/uploads', uploadRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Soul And Success API is running'
  });
});

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

// 3) GLOBAL ERROR HANDLING MIDDLEWARE
app.use(errorHandler);

export default app;
