import sharp from "sharp";
import fs from "fs";
import path from "path";

const targets = [
	"client/src/assets/thegenuineloveproject_logo_v2.png",
	"client/src/assets/mmhb_brand_logo_lockup.png"
];

for (const file of targets) {
	if (!fs.existsSync(file)) continue;

	const parsed = path.parse(file);

	await sharp(file)
		.webp({ quality: 82 })
		.toFile(`${parsed.dir}/${parsed.name}.webp`);

	console.log(`Optimized: ${file}`);
}