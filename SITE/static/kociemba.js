function sendKociembaAlg() {
    const solve = document.getElementById('solve').innerHTML;
    const solveArr = solve.split(' ');

    const abc = toByteArr(solveArr).join().replaceAll(',','');
    console.log(abc);
    
    window.open(`http://localhost:8080/solve?combo=${abc}`);
}

function toByteArr(x) {
    for (let i = 0; i < x.length; i++) {
        x[i] = byteToMoveInterface(x[i]);
    }
    return x;
}
function byteToMoveInterface(x) {
    switch (x[0].toLowerCase()) {
        case 'u':
            if (x[1] == null) {
                x = 'a';
            } else if (x[1] == "'") {
                x = 'b';
            } else if (x[1] == "2") {
                x = 'm';
            }
            break;
        case 'f':
            if (x[1] == null) {
                x = 'c';
            } else if (x[1] == "'") {
                x = 'd';
            } else if (x[1] == "2") {
                x = 'n';
            }
            break;
        case 'd':
            if (x[1] == null) {
                x = 'e';
            } else if (x[1] == "'") {
                x = 'f';
            } else if (x[1] == "2") {
                x = 'o';
            }
            break;
        case 'b':
            if (x[1] == null) {
                x = 'g';
            } else if (x[1] == "'") {
                x = 'h';
            } else if (x[1] == "2") {
                x = 'p';
            }
            break;
        case 'r':
            if (x[1] == null) {
                x = 'i';
            } else if (x[1] == "'") {
                x = 'j';
            } else if (x[1] == "2") {
                x = 'q';
            }
            break;
        case 'l':
            if (x[1] == null) {
                x = 'k';
            } else if (x[1] == "'") {
                x = 'l';
            } else if (x[1] == "2") {
                x = 'r';
            }
            break;
    }
    return x;
    //abcdefghijkl mnopqr
}