const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const inputDir = path.join(__dirname, "public", "players");

const SIZE = 128;

async function convertImages() {
  const files = fs.readdirSync(inputDir);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();

    if (ext !== ".png") {
      continue;
    }

    const inputPath = path.join(inputDir, file);

    const outputFileName =
      path.basename(file, ext) + ".webp";

    const outputPath = path.join(
      inputDir,
      outputFileName
    );

    try {
      await sharp(inputPath)
        .resize(SIZE, SIZE, {
          fit: "cover",
          position: "centre",
        })
        .webp({
          quality: 80,
        })
        .toFile(outputPath);

      console.log(
        `Converted + resized: ${file} -> ${outputFileName}`
      );
    } catch (error) {
      console.error(`Failed: ${file}`, error);
    }
  }

  console.log("Done!");
}

convertImages();
