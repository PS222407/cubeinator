// const { parse } = require('path');
const express = require('express');
const serialPort = require('serialport');
const app = express();
let count = 0;

let solveArray = [];

const byteArrLength = 63;
const numberOfArr = 5;

class byteArr {
    constructor(id, arr) {
        this.id = id;
        this.arr = arr;
    }
}
let byteArray = [];
for (let i = 0; i < numberOfArr; i++) {
    byteArray.push(new byteArr(i));
}

app.get('/solve', (req, res) => {
    res.send("Sending Data");
    solveArray = req.query.combo.split('');

    // console.log(solveArray);

    splitArr(solveArray);
    fillZero();
    flattenArray();

    // console.log(byteArray[0].arr);
    // console.log(byteArray[1].arr);
    // console.log(byteArray[2].arr);
    // console.log(byteArray[3].arr);
    // console.log(byteArray[4].arr);

    const port = new serialPort(
        'COM8',
        { baudRate: 9600 }
    )
    const parser = new serialPort.parsers.Readline()
    port.pipe(parser)
    
    parser.on('data', (line) => {
        console.log('Arduino dice: ' + line)
    
        if (count == 0) {
            port.write(byteArray[0].arr);
            count++;
        }
        else if (line == 0) {
            port.write(byteArray[1].arr);
            count++;
        }
        else if (line == 1) {
            port.write(byteArray[2].arr);
            count++;
        }
        else if (line == 2) {
            port.write(byteArray[3].arr);
            count++;
        }
        else if (line == 3) {
            port.write(byteArray[4].arr);
            count++;
        }
    })
})
app.listen(8080);



//#region SPLIT ARRAY IN 5
function splitArr(x) {
    let currentChunk = 0;
    for (let i = 0; i < byteArray.length; i++) {
        byteArray[i].arr = x.slice(currentChunk, byteArrLength * (i + 1));
        currentChunk += byteArrLength;
    }
}
function fillZero() {
    for (let i = 0; i < byteArray.length; i++) {
        if (byteArray[i].arr.length < 63) {
            for (let j = byteArray[i].arr.length; j < byteArrLength; j++) {
                byteArray[i].arr.push('0');
            }
        }
    }
    byteArray[numberOfArr - 1].arr[62] = '1';
}
function flattenArray() {
    for (let i = 0; i < byteArray.length; i++) {
        byteArray[i].arr = byteArray[i].arr.join().replaceAll(",","");
    }
}
//#endregion