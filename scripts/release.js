#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ---- 1. Determine release type ----
const releaseType = process.argv[2]
if (!['patch', 'minor', 'major'].includes(releaseType)) {
    console.error('❌ Usage: node scripts/release.js [patch|minor|major]');
    process.exit(1);
}

// ---- 2. Version helpers ----
function bumpVersion(version, type) {
    let [major, minor, patch] = version.split('.').map(Number);

    if (type === 'patch') patch++
    if (type === 'minor') { minor++; patch = 0 }
    if (type === 'major') { major++; minor = 0; patch = 0 }

    return `${major}.${minor}.${patch}`;
}

// ---- 3. Read root version ----
const rootPath = path.resolve('./package.json');
const rootPkg = JSON.parse(fs.readFileSync(rootPath, 'utf8'));
const newVersion = bumpVersion(rootPkg.version, releaseType);

// ---- 4. Update version in root and all packages ----
rootPkg.version = newVersion;
fs.writeFileSync(rootPath, JSON.stringify(rootPkg, null, 2));
console.log(`📦 Updated root version to ${newVersion}`);

const packagesDir = path.resolve('./packages');
const packages = fs.readdirSync(packagesDir).filter(name =>
    fs.existsSync(path.join(packagesDir, name, 'package.json'))
);

packages.forEach(name => {
    const pkgPath = path.join(packagesDir, name, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    pkg.version = newVersion;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log(`📦 Updated ${pkg.name} to ${newVersion}`);
})

// ---- 5. Commit and tag ----
try {
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "release: v${newVersion}"`, { stdio: 'inherit' });
    execSync(`git tag v${newVersion}`, { stdio: 'inherit' });
    console.log(`🏷️  Tagged v${newVersion}`);
} catch (e) {
    console.error('❌ Git commit/tag failed');
    process.exit(1);
}

// ---- 6. Optional: Publish packages (uncomment to activate) ----
// packages.forEach(name => {
//   const pkgPath = path.join(packagesDir, name)
//   try {
//     execSync(`cd ${pkgPath} && npm publish --access public`, { stdio: 'inherit' })
//     console.log(`📤 Published ${name}`)
//   } catch (err) {
//     console.error(`❌ Failed to publish ${name}`, err.message)
//   }
// })

console.log(`🎉 Release v${newVersion} complete`);
