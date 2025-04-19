import { Transform } from "./src/features/transform/schema";

declare global {
  namespace Express {
    interface Request {
      transformOptions?: Transform["options"];
      transformPath?: Transform["path"];
    }
  }
}
