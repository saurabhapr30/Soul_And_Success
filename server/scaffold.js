const fs = require('fs');
const path = require('path');

const models = [
  'User', 'Address', 'Product', 'Category', 'Review', 'Cart', 'Order',
  'Coupon', 'BlogPost', 'Course', 'Service', 'Book', 'ContactMessage',
  'NewsletterSubscriber', 'Promotion', 'SiteSettings'
];

const baseDir = path.join(__dirname, 'src');

const directories = [
  'controllers', 'routes', 'services', 'validators', 'utils', 'types', 'middleware'
];

directories.forEach(dir => {
  const dirPath = path.join(baseDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

models.forEach(model => {
  const lowerModel = model.charAt(0).toLowerCase() + model.slice(1);
  
  // Controller
  const controllerCode = `import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessResponse } from '../utils/response';
import * as ${lowerModel}Service from '../services/${lowerModel}Service';

export const getAll${model}s = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await ${lowerModel}Service.getAll${model}s(req.query);
  sendSuccessResponse({ res, data });
});

export const get${model} = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await ${lowerModel}Service.get${model}ById(req.params.id);
  sendSuccessResponse({ res, data });
});

export const create${model} = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await ${lowerModel}Service.create${model}(req.body);
  sendSuccessResponse({ res, statusCode: 201, data });
});

export const update${model} = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const data = await ${lowerModel}Service.update${model}(req.params.id, req.body);
  sendSuccessResponse({ res, data });
});

export const delete${model} = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await ${lowerModel}Service.delete${model}(req.params.id);
  sendSuccessResponse({ res, statusCode: 204, data: null });
});
`;
  fs.writeFileSync(path.join(baseDir, 'controllers', `${lowerModel}Controller.ts`), controllerCode);

  // Service
  const serviceCode = `import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export const getAll${model}s = async (query: any) => {
  return await prisma.${lowerModel}.findMany();
};

export const get${model}ById = async (id: string) => {
  const data = await prisma.${lowerModel}.findUnique({ where: { id } });
  if (!data) throw new NotFoundError('${model} not found');
  return data;
};

export const create${model} = async (data: any) => {
  return await prisma.${lowerModel}.create({ data });
};

export const update${model} = async (id: string, data: any) => {
  return await prisma.${lowerModel}.update({ where: { id }, data });
};

export const delete${model} = async (id: string) => {
  return await prisma.${lowerModel}.delete({ where: { id } });
};
`;
  fs.writeFileSync(path.join(baseDir, 'services', `${lowerModel}Service.ts`), serviceCode);

  // Routes
  const routeCode = `import { Router } from 'express';
import * as ${lowerModel}Controller from '../controllers/${lowerModel}Controller';

const router = Router();

router
  .route('/')
  .get(${lowerModel}Controller.getAll${model}s)
  .post(${lowerModel}Controller.create${model});

router
  .route('/:id')
  .get(${lowerModel}Controller.get${model})
  .patch(${lowerModel}Controller.update${model})
  .delete(${lowerModel}Controller.delete${model});

export default router;
`;
  fs.writeFileSync(path.join(baseDir, 'routes', `${lowerModel}Routes.ts`), routeCode);
});

console.log('Scaffolding complete!');
