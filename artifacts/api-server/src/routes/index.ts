import { Router, type IRouter } from "express";
import healthRouter from "./health";
import creatorRouter from "./creator";
import campaignsRouter from "./campaigns";
import productsRouter from "./products";
import linksRouter from "./links";
import conversationsRouter from "./conversations";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(creatorRouter);
router.use(campaignsRouter);
router.use(productsRouter);
router.use(linksRouter);
router.use(conversationsRouter);
router.use(dashboardRouter);

export default router;
