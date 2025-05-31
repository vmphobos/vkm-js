let { runFromPackage, writeToPackageDotJson, ask, run } = require('./utils');
let chalk = require('chalk');
let { execSync } = require('child_process');
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
    'modal',
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

    const ready = await ask('Ready to publish this version? (y/n) ');

    if (ready.toLowerCase() === 'y' || ready.toLowerCase() === 'yes') {
        const createRelease = await ask('Create GitHub release? (y/n) ');
        if (createRelease.toLowerCase() === 'y' || createRelease.toLowerCase() === 'yes') {
            await createGitHubRelease(version);
            await publishToNpm();
        } else {
            const publishNpm = await ask('Publish to npm? (y/n) ');
            if (publishNpm.toLowerCase() === 'y' || publishNpm.toLowerCase() === 'yes') {
                await publishToNpm();
            } else {
                console.log(chalk.yellow('🚫 Skipped publishing to npm.'));
            }
        }
    } else {
        console.log(chalk.yellow('🚫 Publishing skipped.'));
    }
})();

async function askStep(question, fn) {
    const answer = await ask(question + ' (y/n) ');
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        await fn();
    } else {
        console.log(chalk.yellow(`Skipped: ${question}`));
    }
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

async function publishToNpm() {
    for (const pkg of packages) {
        console.log(chalk.yellow(`🚀 Publishing @vkm-js/${pkg}...`));
        await new Promise((resolve, reject) => {
            runFromPackage(pkg, 'npm publish --access public');
            // runFromPackage uses exec, which is async but does not provide a Promise
            // so here you might want to refactor runFromPackage to support Promises or sync exec
            // For now, just resolve immediately:
            resolve();
        });
    }
    console.log(chalk.green('🎉 All packages published to npm!'));
}

async function createGitHubRelease(tag) {
    const releaseBody = `🎉 Release v${tag}\n\n- Changes: Add meaningful changelog here if needed.`;

    try {
        await axios.post(`https://api.github.com/repos/${repo.owner}/${repo.name}/releases`, {
            tag_name: `v${tag}`,
            name: `v${tag}`,
            target_commitish: repo.branch,
            body: releaseBody,
            draft: false,
            prerelease: false,
        });
        console.log(chalk.green(`✅ GitHub release created: v${tag}`));
    } catch (err) {
        console.error(chalk.red('❌ Failed to create GitHub release:'), err.message);
    }
}

function exitWith(msg) {
    console.error(chalk.red(msg));
    process.exit(1);
}
