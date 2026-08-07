const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const AdmZip = require('adm-zip');

const docxFiles = [
  'AT&DF设备运维SOP.docx',
  'BTS项目.docx',
  'DF -iphone 5月29日SOP.docx',
  'SW采集sop.docx',
  'ST供应商-通用型SOP.docx'
];

const outputDir = 'extracted';
const imagesDir = path.join(outputDir, 'images');

async function extractText(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error(`Error extracting text from ${filePath}:`, error);
    return '';
  }
}

function extractImages(filePath, outputDir) {
  try {
    const zip = new AdmZip(filePath);
    const zipEntries = zip.getEntries();
    const mediaDir = 'word/media/';
    
    zipEntries.forEach(entry => {
      if (entry.entryName.startsWith(mediaDir) && !entry.isDirectory) {
        const fileName = path.basename(entry.entryName);
        const outputPath = path.join(outputDir, fileName);
        fs.writeFileSync(outputPath, zip.readFile(entry));
        console.log(`Extracted image: ${fileName}`);
      }
    });
  } catch (error) {
    console.error(`Error extracting images from ${filePath}:`, error);
  }
}

async function main() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  for (const fileName of docxFiles) {
    const filePath = path.join(__dirname, '..', fileName);
    
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      continue;
    }

    console.log(`\n=== Processing ${fileName} ===`);
    
    const text = await extractText(filePath);
    const textOutputPath = path.join(outputDir, `${path.parse(fileName).name}.txt`);
    fs.writeFileSync(textOutputPath, text, 'utf-8');
    console.log(`Extracted text saved to: ${textOutputPath}`);
    
    extractImages(filePath, imagesDir);
  }

  console.log('\n=== Extraction complete ===');
  console.log(`All content saved to: ${path.resolve(outputDir)}`);
}

main();
