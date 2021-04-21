const fs = require('fs');

const prepFile = async function () {
    if (fs.existsSync('numbers.txt')) fs.unlinkSync('numbers.txt');

    const ws = fs.createWriteStream('numbers.txt');

    for (let i = 0; i < 100; i++) {
        ws.write(`${i}`);
    }

    ws.close();
};

function readFile() {
    let str = '';

    const rs = fs.createReadStream('numbers.txt');

    rs.on('data', function (data) {
        str += data;
    });

    return str;
}

function readFileAsync() {
    return new Promise((resolve, reject) => {
        let str = '';

        const rs = fs.createReadStream('numbers.txt');

        rs.on('data', function (data) {
            console.log('chunk', data);
            str += data.toString();
        });

        rs.on('end', function () {
            resolve(str);
        });

        rs.on('error', function () {
            reject();
        });
    });
}

async function run() {
    await prepFile();

    const sync = readFile();
    console.log('Sync result', sync);

    const asyncResult = readFileAsync();
    console.log('Async result', asyncResult);

    // asyncResult.then((promiseResult) => {
    //     console.log('result from async processing', promiseResult);
    // });

    const awaitedResult = await readFileAsync();
    console.log('Awaited result', awaitedResult);

    fs.unlinkSync('numbers.txt');
}

run();
