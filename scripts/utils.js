let DotJson = require('dot-json');
let { exec } = require('child_process');

module.exports.runFromPackage = function (packageName, command) {
    return new Promise((resolve, reject) => {
        exec(command, { cwd: __dirname + '/../packages/' + packageName }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error running command in package ${packageName}:`, stderr);
                return reject(error);
            }
            resolve(stdout);
        });
    });
};

module.exports.run = function (command) {
    return new Promise((resolve, reject) => {
        exec(command, { cwd: __dirname + '/..' }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error running command:`, stderr);
                return reject(error);
            }
            resolve(stdout);
        });
    });
};

module.exports.writeToPackageDotJson = function (packageName, key, value) {
    let dotJson = new DotJson(`./packages/${packageName}/package.json`);
    dotJson.set(key, value).save();
};

module.exports.getFromPackageDotJson = function (packageName, key) {
    let dotJson = new DotJson(`./packages/${packageName}/package.json`);
    return dotJson.get(key);
};

module.exports.ask = function(message) {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => {
        rl.question(message, answer => {
            rl.close();
            resolve(answer.trim());
        });
    });
};
