import { AppError } from "@lib/errors";
import { type Transform } from "./schema";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { UPLOAD_PATH } from "@lib/constants";

export const transformService = async (data: Transform) => {
  const _path = path.join(process.cwd(), UPLOAD_PATH, data.path);
  const imageExists = fs.existsSync(_path);
  if (!imageExists) {
    throw new AppError("Image does not exist");
  }

  const fileExt = path
    .extname(_path)
    .split(".")[1] as Transform["options"]["format"];
  const format = data.options.format ?? fileExt;

  const image = fs.readFileSync(_path);
  const resize = sharp(image).resize({
    height: data.options.height,
    width: data.options.width,
  });

  switch (format) {
    case "png":
      resize.png({ quality: data.options.quality });
      break;
    case "jpg":
      resize.jpeg({ quality: data.options.quality });
      break;
    case "webp":
      resize.webp({ quality: data.options.quality });
      break;

    default:
      throw new AppError("Invalid format");
  }

  const result = await resize.toBuffer({ resolveWithObject: true });
  return result;
};
