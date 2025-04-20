import transformRouter from "@features/transform/route";
import { UPLOAD_PATH } from "@lib/constants";
import express from "express";
import fs from "fs";
import path from "path";

const app = express();

const uploadPath = path.join(process.cwd(), UPLOAD_PATH);
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

app.use(transformRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
