const puppeteer = require("puppeteer");
const express = require("express");
const fs = require("fs");
const http = require("http");
const rimraf = require('rimraf');
const { join, dirname } = require("path");

exports.generateOgImages = async (imageGenerationJobs) => {
  const servingUrl = await getServingUrl();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let generatedPath = null;

  for (const imageGenerationJob of imageGenerationJobs) {
    const { componentPath, imgPath, size } = imageGenerationJob;
    const componentUrl = `${servingUrl}/${componentPath}`;
    if (componentPath.split('/')[0]) generatedPath = componentPath.split('/')[0]

    await page.goto(componentUrl);
    await page.setViewport(size);

    ensureThatImageDirExists(imgPath);
    await page.screenshot({ path: imgPath, clip: { x: 0, y: 0, ...size } });

    const printPath = `${imgPath.replace("public", "")} ${size.width}x${size.height}`;
    console.log(`🖼  created Image: ${printPath}`);
  }

  rimraf.sync(join("public", generatedPath));
  rimraf.sync(join("public", "page-data", generatedPath));
  await browser.close();
};

const getServingUrl = async () => {
  const app = express();
  app.use(express.static("public"));
  const server = http.createServer(app);
  await server.listen(0);
  return `http://0.0.0.0:${server.address().port}/`;

};

const ensureThatImageDirExists = (path) => {
  const targetDir = dirname(path);

  try {
    fs.statSync(targetDir);
  } catch (err) {
    if (err.code === "ENOENT") {
      fs.mkdirSync(targetDir, { recursive: true });
    }
  }
};
