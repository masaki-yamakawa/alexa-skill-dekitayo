const fs = require('fs');
const archiver = require('archiver');

const p = require("../package.json");
const packageName = p.name;
const output = fs.createWriteStream(`${packageName}.zip`);
const archive = archiver('zip', {
    zlib: { level: 9 }
});

output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

output.on('end', function () {
    console.log('Data has been drained');
});

archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
        // log warning
    } else {
        // throw error
        throw err;
    }
});

archive.on('error', function (err) {
    console.error(err);
    throw err;
});

archive.pipe(output);
archive.append(fs.createReadStream('package.json'), { name: 'package.json' });
archive.directory('build/', 'build');
archive.glob('node_modules/**/*', {
    ignore: [
        'node_modules/archiver/**',
        'node_modules/archiver-utils/**',
        'node_modules/aws-sdk/**',
        'node_modules/tslint/**',
        'node_modules/typescript/**'
    ]
});
archive.finalize();
