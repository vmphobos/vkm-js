const { writeToPackageDotJson, getFromPackageDotJson } = require('./utils');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const esbuild = require('esbuild');

// Auto-detect all packages in ./packages
const packages = fs.readdirSync('./packages').filter((dir) =>
    fs.existsSync(`./packages/${dir}/builds`)
);

packages.forEach((pkg) => {
    const distPath = `./packages/${pkg}/dist`
    if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath, 0o744);
    }

    // Build all files inside ./builds (like cdn.js, module.js)
    fs.readdirSync(`./packages/${pkg}/builds`).forEach((file) => {
        bundleFile(pkg, file);
    })
});

function bundleFile(packageName, file) {
    const inputPath = `packages/${packageName}/builds/${file}`;
    const distPath = `packages/${packageName}/dist`;

    const buildTypes = {
        'cdn.js': () => {
            // Non-minified version
            build({
                entryPoints: [inputPath],
                outfile: `${distPath}/${file}`,
                bundle: true,
                platform: 'browser',
                define: {
                    CDN: 'true',
                },
            })

            // Minified version
            build({
                entryPoints: [inputPath],
                outfile: `${distPath}/${file.replace('.js', '.min.js')}`,
                bundle: true,
                minify: true,
                platform: 'browser',
                define: {
                    CDN: 'true',
                },
            }).then(() => {
                outputSize(packageName, `${distPath}/${file.replace('.js', '.min.js')}`)
            })
        },

        'module.js': () => {
            // ESM
            build({
                entryPoints: [inputPath],
                outfile: `${distPath}/${file.replace('.js', '.esm.js')}`,
                bundle: true,
                platform: 'neutral',
                mainFields: ['module', 'main'],
            })

            // CommonJS
            build({
                entryPoints: [inputPath],
                outfile: `${distPath}/${file.replace('.js', '.cjs.js')}`,
                bundle: true,
                target: ['node10.4'],
                platform: 'node',
            }).then(() => {
                writeToPackageDotJson(packageName, 'main', `dist/${file.replace('.js', '.cjs.js')}`)
                writeToPackageDotJson(packageName, 'module', `dist/${file.replace('.js', '.esm.js')}`)
            })
        },
    }

    if (buildTypes[file]) {
        buildTypes[file]();
    } else {
        console.warn(`⚠️ Unknown build file type: ${file} (skipped)`);
    }
}

function build(options) {
    options.define = options.define || {};

    options.define['ALPINE_VERSION'] = `'${getFromPackageDotJson('alpinejs', 'version')}'`;
    options.define['process.env.NODE_ENV'] = process.argv.includes('--watch') ? `'development'` : `'production'`;

    return esbuild.build({
        logLevel: process.argv.includes('--watch') ? 'info' : 'silent',
        watch: process.argv.includes('--watch'),
        ...options,
    }).catch(() => process.exit(1));
}

function outputSize(packageName, file) {
    const size = bytesToSize(zlib.brotliCompressSync(fs.readFileSync(file)).length);
    console.log(`\x1b[32m✔ ${packageName}: ${path.basename(file)} = ${size}`);
}

function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i === 0) return `${bytes} ${sizes[i]}`;
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
}
