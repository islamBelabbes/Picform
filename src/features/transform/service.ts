import { AppError } from "@lib/errors";
import { Transform } from "./schema";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { UPLOAD_PATH } from "@lib/constants";

export const transformService = async (data: Transform) => {
  const _path = path.join(process.cwd(), UPLOAD_PATH, data.url);
  const imageExists = fs.existsSync(_path);
  if (!imageExists) {
    throw new AppError("Image does not exist");
  }

  const image = fs.readFileSync(_path);
  const resize = sharp(image).resize({
    height: data.options.height,
    width: data.options.width,
  });

  switch (data.options.format) {
    case "png":
      resize.png({ quality: data.options.quality });
      break;
    case "jpg":
      resize.jpeg({ quality: data.options.quality });
      break;
    case "webp":
      resize.webp({ quality: data.options.quality });
      break;
  }

  const result = await resize.toBuffer({ resolveWithObject: true });
  return result;
};
