import { NextFunction, Request, Response } from "express";
import { transformSchema } from "./schema";
import { ratelimit } from "@lib/upstach";

export const parseTransformRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const _options = req.params[0];
  const path = req.params[1];

  let options = _options
    .split(",")
    .reduce<Record<string, unknown>>((acc, current) => {
      const [key, value] = current.split("=");
      acc[key] = value;
      return acc;
    }, {});

  const validated = transformSchema.safeParse({
    path,
    options,
  });

  if (!validated.success) {
    res.status(400).send({
      success: false,
      message: "invalid request",
      errors: validated.error.errors.map((i) => ({
        path: Array.isArray(i.path) ? i.path[1] : i.path,
        message: i.message,
      })),
    });
    return;
  }

  req.transformOptions = validated.data.options;
  req.transformPath = validated.data.path;

  next();
};

export const rateLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const path = req.transformPath;

  if (!path) {
    res.status(400).send("middleware missing");
    return;
  }

  const key = `${req.ip}-${path}`;
  const limit = await ratelimit.limit(key);
  if (!limit.success) {
    const retry = Math.max(0, Math.floor((limit.reset - Date.now()) / 1000));
    res.setHeader("Retry-After", retry);
    res.status(429).send({
      success: false,
      message: "too many requests",
    });
    return;
  }

  return next();
};
