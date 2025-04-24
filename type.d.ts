import { Transform } from "@features/transform/schema";

declare global {
  namespace Express {
    interface Request {
      transformOptions?: Transform["options"];
      transformPath?: Transform["path"];
    }
  }
}
