import { Router } from 'express';
import userRoutes from './user-routes.js';
import chatRoutes from './chats-routes.js';

const appRouter = Router();

appRouter.use('/users', userRoutes); // domain/api/v1/user/user
appRouter.use('/chats', chatRoutes);

export default appRouter;