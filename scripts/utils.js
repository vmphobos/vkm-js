const fs = require('fs');
const path = require('path');

function writeToPackageDotJson(packageName, key, value) {
    const pkgPath = path.resolve(`packages/${packageName}/package.json`);
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    pkg[key] = value;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log(`📦 Updated ${key} in ${packageName} → ${value}`);
}

function getFromPackageDotJson(packageName, key) {
    const pkgPath = require.resolve(`${packageName}/package.json`, { paths: [process.cwd()] });
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return pkg[key];
}

module.exports = {
    writeToPackageDotJson,
    getFromPackageDotJson
}
