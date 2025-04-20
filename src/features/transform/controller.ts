import { type Response, type Request } from "express";
import { transformService } from "./service";
import { safe } from "@lib/safe";
import { AppError } from "@lib/errors";

export const transformController = async (req: Request, res: Response) => {
  const path = req.transformPath;
  const options = req.transformOptions;

  if (!options || !path) {
    res.status(400).send("middleware missing");
    return;
  }

  const data = await safe(transformService({ path, options }));
  if (!data.success) {
    if (data.error instanceof AppError) {
      res.status(400).send({
        success: false,
        message: data.error.message,
      });
      return;
    }
    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
    return;
  }

  res.setHeader(
    "Content-Disposition",
    `inline; filename=transformed.${data.data.info.format}`
  );
  res.setHeader("Content-Type", `image/${data.data.info.format}`);
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.send(data.data.data);
};
