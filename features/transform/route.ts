import { Router } from "express";
import { transformController } from "./controller";
import { parseTransformRequest, rateLimit } from "./middleware";

const transformRouter = Router();

transformRouter.get(
  /^\/transform\/([a-zA-Z0-9=,]+)\/(.+)$/,
  parseTransformRequest,
  rateLimit,
  transformController
);

export default transformRouter;
