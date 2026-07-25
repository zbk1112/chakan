const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'extracted', 'images');
const destDir = path.join(__dirname, '..', 'src', 'assets', 'images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir);

const dfImages = ['image1.jpeg', 'image2.jpeg', 'image3.jpeg', 'image4.jpeg'];
const btsImages = ['image1.jpeg', 'image2.jpeg'];
const swImages = ['image1.png', 'image2.png', 'image3.png', 'image4.png', 'image5.png', 'image6.png'];

files.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const ext = path.extname(file);
  
  let newName;
  if (dfImages.includes(file)) {
    const index = dfImages.indexOf(file);
    newName = `df_case_${index + 1}${ext}`;
  } else if (btsImages.includes(file)) {
    const index = btsImages.indexOf(file);
    newName = `bts_image_${index + 1}${ext}`;
  } else if (swImages.includes(file)) {
    const index = swImages.indexOf(file);
    newName = `sw_image_${index + 1}${ext}`;
  } else {
    newName = file;
  }
  
  const destPath = path.join(destDir, newName);
  fs.copyFileSync(sourcePath, destPath);
  console.log(`Copied: ${file} -> ${newName}`);
});

console.log('\nAll images copied successfully!');
