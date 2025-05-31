let { runFromPackage, writeToPackageDotJson, ask, run } = require('./utils');
let chalk = require('chalk');
let { execSync } = require('child_process');
let fs = require('fs');
let axios = require('axios').create({
    headers: { Authorization: `Bearer ${require('./.env.json').GITHUB_TOKEN}` }
});

let version = process.argv[2];
if (!version) return exitWith('❌ You must pass a version number: npm run release 1.0.0');
if (!/^\d+\.\d+\.\d+$/.test(version)) return exitWith(`❌ Invalid version: ${version}`);

let packages = [
    'closeable',
    'dropdown',
    'popover',
    // Add more packages here
];

let repo = {
    owner: 'vmphobos',
    name: 'x-dom',
    branch: 'main'
};

(async () => {
    await askStep('Bump versions?', bumpVersions);
    await askStep('Build assets?', buildAssets);
    await askStep('Commit and tag version?', commitAndTagVersion);
    await askStep('Push to GitHub?', pushToGitHub);

    await new Promise(resolve => {
        ask('Ready to publish this version? (y/n) ', async answer => {
            if (answer.toLowerCase() === 'y') {
                await askStep('Create GitHub release?', cb => createGitHubRelease(version, cb));
                await askStep('Publish to npm?', publishToNpm);
            } else {
                console.log(chalk.yellow('🚫 Publishing skipped.'));
            }
            resolve();
        });
    });
})();

function askStep(question, fn) {
    return new Promise(resolve => {
        ask(question + ' (y/n) ', answer => {
            if (answer.toLowerCase() === 'y') {
                Promise.resolve(fn()).then(resolve);
            } else {
                console.log(chalk.yellow(`Skipped: ${question}`));
                resolve();
            }
        });
    });
}

function bumpVersions() {
    packages.forEach(pkg => {
        writeToPackageDotJson(pkg, 'version', version);
        console.log(chalk.green(`🔢 Bumped version in ${pkg} to ${version}`));
    });
}

function buildAssets() {
    console.log(chalk.blue('🔨 Building assets...'));
    require('./build');
}

function commitAndTagVersion() {
    console.log(chalk.cyan('📦 Committing version bump...'));
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "v${version}"`, { stdio: 'inherit' });
    execSync(`git tag v${version}`, { stdio: 'inherit' });
    console.log(chalk.green(`✅ Tagged as v${version}`));
}

function pushToGitHub() {
    console.log(chalk.yellow('📤 Pushing to GitHub...'));
    execSync(`git push origin ${repo.branch} --tags`, { stdio: 'inherit' });
}

function publishToNpm() {
    packages.forEach(pkg => {
        console.log(chalk.yellow(`🚀 Publishing @xdom/${pkg}...`));
        runFromPackage(pkg, 'npm publish --access public');
    });
    console.log(chalk.green('🎉 All packages published to npm!'));
}

function createGitHubRelease(tag, callback) {
    const releaseBody = `🎉 Release v${tag}\n\n- Changes: Add meaningful changelog here if needed.`;

    axios.post(`https://api.github.com/repos/${repo.owner}/${repo.name}/releases`, {
        tag_name: `v${tag}`,
        name: `v${tag}`,
        target_commitish: repo.branch,
        body: releaseBody,
        draft: false,
        prerelease: false,
    })
        .then(() => {
            console.log(chalk.green(`✅ GitHub release created: v${tag}`));
            callback();
        })
        .catch(err => {
            console.error(chalk.red('❌ Failed to create GitHub release:'), err.message);
            callback();
        });
}

function exitWith(msg) {
    console.error(chalk.red(msg));
    process.exit(1);
}
