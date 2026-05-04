const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { minify: minifyHtml } = require('html-minifier-terser');
const CleanCSS = require('clean-css');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const optimizeImages = process.argv.includes('--optimize-images');
const textExtensions = new Set(['.html', '.css', '.txt', '.xml', '.webmanifest']);
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
let sharp = null;

const requiredPaths = [
  'index.html',
  'camera.html',
  'styles.css',
  'camera.css',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'site.webmanifest',
  'browserconfig.xml',
  'favicon.ico',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'favicon-48x48.png',
  'favicon-96x96.png',
  'apple-touch-icon.png',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
  'icon-maskable-192x192.png',
  'icon-maskable-512x512.png',
  'mstile-150x150.png',
  'assets/images/fachada.webp',
  'assets/images/fachada.jpg',
  'assets/images/camera-esquerda.webp',
  'assets/images/camera-direita.webp',
  'assets/images/camera-iniciando.webp',
];

function assertRequiredPathsExist() {
  const missingPaths = requiredPaths.filter((relativePath) => {
    return !fs.existsSync(path.join(rootDir, relativePath));
  });

  if (missingPaths.length > 0) {
    throw new Error(`Missing required production files:\n${missingPaths.join('\n')}`);
  }
}

function recreateDistDir() {
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });
}

function copyFile(relativePath) {
  const sourcePath = path.join(rootDir, relativePath);
  const targetPath = path.join(distDir, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

function copyDirectory(relativePath) {
  const sourcePath = path.join(rootDir, relativePath);
  const targetPath = path.join(distDir, relativePath);
  fs.cpSync(sourcePath, targetPath, { recursive: true });
}

function walkFiles(directoryPath) {
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkFiles(entryPath));
      continue;
    }

    files.push(entryPath);
  }

  return files;
}

async function minifyHtmlFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const output = await minifyHtml(source, {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    decodeEntities: true,
    minifyCSS: false,
    minifyJS: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
  });

  fs.writeFileSync(filePath, output);
}

function minifyCssFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const result = new CleanCSS({ level: 2 }).minify(source);

  if (result.errors.length > 0) {
    throw new Error(`CSS minification failed for ${filePath}:\n${result.errors.join('\n')}`);
  }

  fs.writeFileSync(filePath, result.styles);
}

async function optimizeImageFile(filePath) {
  if (!sharp) {
    return false;
  }

  const extension = path.extname(filePath).toLowerCase();
  const imagePipeline = sharp(filePath, { animated: false });
  const metadata = await imagePipeline.metadata();

  if (extension === '.jpg' || extension === '.jpeg') {
    await imagePipeline
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(`${filePath}.tmp`);
  } else if (extension === '.png') {
    await imagePipeline
      .png({ compressionLevel: 9, palette: metadata.hasAlpha !== true })
      .toFile(`${filePath}.tmp`);
  } else if (extension === '.webp') {
    await imagePipeline
      .webp({ quality: 82, effort: 6 })
      .toFile(`${filePath}.tmp`);
  } else {
    return false;
  }

  fs.renameSync(`${filePath}.tmp`, filePath);
  return true;
}

function writeCompressedVariant(filePath, encoding) {
  const source = fs.readFileSync(filePath);
  const compressed =
    encoding === 'gzip'
      ? zlib.gzipSync(source, { level: zlib.constants.Z_BEST_COMPRESSION })
      : zlib.brotliCompressSync(source, {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
          },
        });
  const suffix = encoding === 'gzip' ? '.gz' : '.br';
  fs.writeFileSync(`${filePath}${suffix}`, compressed);
}

async function optimizeDistFiles() {
  const distFiles = walkFiles(distDir);
  let optimizedImageCount = 0;

  for (const filePath of distFiles) {
    const extension = path.extname(filePath).toLowerCase();

    if (extension === '.html') {
      await minifyHtmlFile(filePath);
    } else if (extension === '.css') {
      minifyCssFile(filePath);
    } else if (optimizeImages && imageExtensions.has(extension)) {
      const optimized = await optimizeImageFile(filePath);
      if (optimized) {
        optimizedImageCount += 1;
      }
    }
  }

  const compressedTargets = walkFiles(distDir).filter((filePath) => {
    return textExtensions.has(path.extname(filePath).toLowerCase());
  });

  for (const filePath of compressedTargets) {
    writeCompressedVariant(filePath, 'gzip');
    writeCompressedVariant(filePath, 'brotli');
  }

  return { optimizedImageCount };
}

function loadOptionalImageOptimizer() {
  if (!optimizeImages) {
    return;
  }

  try {
    sharp = require('sharp');
  } catch (error) {
    console.warn('Image optimization requested, but sharp is unavailable. Copying images without optimization.');
  }
}

async function buildProductionBundle() {
  assertRequiredPathsExist();
  loadOptionalImageOptimizer();
  recreateDistDir();

  const rootFilesToCopy = [
    'index.html',
    'camera.html',
    'styles.css',
    'camera.css',
    'robots.txt',
    'sitemap.xml',
    'llms.txt',
    'site.webmanifest',
    'browserconfig.xml',
    'favicon.ico',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'favicon-48x48.png',
    'favicon-96x96.png',
    'apple-touch-icon.png',
    'android-chrome-192x192.png',
    'android-chrome-512x512.png',
    'icon-maskable-192x192.png',
    'icon-maskable-512x512.png',
    'mstile-150x150.png',
  ];

  for (const relativePath of rootFilesToCopy) {
    copyFile(relativePath);
  }

  copyDirectory('assets');

  const { optimizedImageCount } = await optimizeDistFiles();
  const imageMessage = optimizeImages
    ? ` Image optimization ${sharp ? `processed ${optimizedImageCount} file(s).` : 'was skipped.'}`
    : '';

  console.log(`Production files written to ${distDir}.${imageMessage}`);
}

buildProductionBundle().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
