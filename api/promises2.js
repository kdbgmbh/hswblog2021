const sleep = () =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('test');
            resolve(3);
        }, 2000);
    });

function log() {
    console.log('first log');
    console.log('calling sleep');

    const result = sleep();
    console.log('sleepResult', result);

    result
        .then(multiply)
        .then(multiply)
        .then(multiply)
        .then(multiply)
        .then(multiply)
        .then(multiply)
        .then((value) => {
            console.log(value);
        });
}

async function run() {
    console.log('first log');
    console.log('calling sleep');

    const result = await sleep();
    console.log('sleepResult', result);
}

function multiply(value) {
    return value * 3;
}

run();
