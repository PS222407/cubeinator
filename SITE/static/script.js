//#region GLOBAL VARIABLES
const sidesCount = 4;
const cubeSize = 3;
let showArrowDirection = true;
let spd = 25; // miliseconds
let scrambleLength = 20;
let scrambleAnimation = 1; //0 = off, 1 = on

const cubecontainer = document.getElementsByClassName('cube-container')[0];
const solveBtn = document.getElementById('solve-button');

let y = 0;
let x = 0;

let whiteCrossSolved = false;
let whiteCornersSolved = false;
let secondLayerSolved = false;
let yellowCrossSolved = false;
let yellowCrossAligned = false;

let yellowCornerFound = false;
let checkAlignmentSecondCheck = false;

let goodYellowCorners = 0;
let bottomTurnCount = 0;

let ygo = false;
let ygr = false;
let ybo = false;
let ybr = false;


let solveArray = [];

//#endregion

let cube = [
    [//top
        ['w-1', 'w-2', 'w-3'],
        ['w-4', 'w-5', 'w-6'],
        ['w-7', 'w-8', 'w-9']
    ],
    [//front
        ['g-1', 'g-2', 'g-3'],
        ['g-4', 'g-5', 'g-6'],
        ['g-7', 'g-8', 'g-9']
    ],
    [//bottom
        ['y-1', 'y-2', 'y-3'],
        ['y-4', 'y-5', 'y-6'],
        ['y-7', 'y-8', 'y-9']
    ],
    [//back
        ['b-1', 'b-2', 'b-3'],
        ['b-4', 'b-5', 'b-6'],
        ['b-7', 'b-8', 'b-9']
    ],
    [//right
        ['r-1', 'r-2', 'r-3'],
        ['r-4', 'r-5', 'r-6'],
        ['r-7', 'r-8', 'r-9']
    ],
    [//left
        ['o-1', 'o-2', 'o-3'],
        ['o-4', 'o-5', 'o-6'],
        ['o-7', 'o-8', 'o-9']
    ]
]
let scramble = [];

_onload();
function _onload() {
    const top = document.getElementsByClassName('top')[0];
    const front = document.getElementsByClassName('front')[0];
    const bottom = document.getElementsByClassName('bottom')[0];
    const back = document.getElementsByClassName('back')[0];
    const right = document.getElementsByClassName('right')[0];
    const left = document.getElementsByClassName('left')[0];

    top.innerHTML = '';
    front.innerHTML = '';
    bottom.innerHTML = '';
    back.innerHTML = '';
    right.innerHTML = '';
    left.innerHTML = '';

    for (let j = 0; j < 6; j++) {
        for (let i = 0; i < cubeSize; i++) {
            for (let y = 0; y < cubeSize; y++) {
                let el = document.createElement('div');
                el.innerHTML = cube[j][i][y];
                el.setAttribute('data', cube[j][i][y]);
                el.classList.add('piece')
                switch (j) {
                    case 0:
                        top.appendChild(el);
                        break;
                    case 1:
                        front.appendChild(el);
                        break;
                    case 2:
                        bottom.appendChild(el);
                        break;
                    case 3:
                        back.appendChild(el);
                        break;
                    case 4:
                        right.appendChild(el);
                        break;
                    case 5:
                        left.appendChild(el);
                        break;
                }
            }
        }
    }

    const allPieces = document.getElementsByClassName('piece');
    [...allPieces].forEach(piece => {
        switch (piece.getAttribute('data')[0]) {
            case 'w':
                piece.style.background = 'white';
                break;
            case 'g':
                piece.style.background = 'lime';
                break;
            case 'y':
                piece.style.background = 'yellow';
                break;
            case 'b':
                piece.style.background = 'rgb(0, 110, 255)';
                break;
            case 'r':
                piece.style.background = 'red';
                break;
            case 'o':
                piece.style.background = 'orange';
                break;
        }
    });
}

function resetArrHistory() {
    arrHistorySequence = [];
}
function resetVariables() {
    whiteCrossSolved = false;
    whiteCornersSolved = false;
    secondLayerSolved = false;
    yellowCrossSolved = false;
    yellowCrossAligned = false;
    yellowCornerFound = false;
    checkAlignmentSecondCheck = false;
    goodYellowCorners = 0;

    ygo = false;
    ygr = false;
    ybo = false;
    ybr = false;
}

function setScrambleLength(x) {
    scrambleLength = x;
}
function setSpeed(x) {
    spd = x;
}

function set2d() {
    const cubestaticcontainer = document.getElementsByClassName('cube-static-rotation')[0];
    const sides = document.getElementsByClassName('side');
    const rotatebuttoncontainerbuttons = document.getElementsByClassName('rotate-button-container')[0].children;
    const rotatebuttoncontainer = document.getElementsByClassName('rotate-button-container')[0];
    cubestaticcontainer.classList.toggle('twoD');
    rotatebuttoncontainer.classList.toggle('twoD');
    [...sides].forEach(side => {
        side.classList.toggle('twoD');
    });
    [...rotatebuttoncontainerbuttons].forEach(button => {
        button.classList.toggle('displayNone');
    });
    cubecontainer.style.transform = `rotateY(0deg) rotateZ(-0deg) rotateX(0deg) translateZ(-00px)`;
    y = 0;
    x = 0;
}

const moves = ["u", "u'", "d", "d'", "r", "r'", "l", "l'", "f", "f'", "b", "b'"];
const arrSequence = ['top', 'frt', 'btm', 'bck', 'rgt', 'lft'];
let arrHistorySequence = [];
let scrambleHistorySequence = [];
let arrHistorySequenceModified;

function sequenceHistory(x, y) {
    let container;
    y ? container = document.getElementsByClassName('scramble-sequence-container')[0] : container = document.getElementsByClassName('sequence-container')[0];
    let output;

    if (x[1] == "'") {
        if (y) {
            scrambleHistorySequence.push(x[0].toUpperCase() + "'");
        }
        else {
            arrHistorySequence.push(x[0].toUpperCase() + "'");
        }
    } else {
        if (y) {
            scrambleHistorySequence.push(x[0].toUpperCase() + '');
        }
        else {
            arrHistorySequence.push(x[0].toUpperCase() + '');
        }
    }

    y ? output = scrambleHistorySequence : output = arrHistorySequence;
    container.innerHTML = output.join().replace(/\s*,\s*|\s+,/g, ' ');
}

//#region CUBE TURNS
function rightClockwise(x) {
    let tops = [cube[0][2][2], cube[0][1][2], cube[0][0][2]];
    let fronts = [cube[1][0][2], cube[1][1][2], cube[1][2][2]];
    let bottoms = [cube[2][0][2], cube[2][1][2], cube[2][2][2]];
    let backs = [cube[3][2][0], cube[3][1][0], cube[3][0][0]];
    let rights = [cube[4][0][0], cube[4][0][1], cube[4][0][2], cube[4][1][0], cube[4][1][2], cube[4][2][0], cube[4][2][1], cube[4][2][2]];

    //tops
    cube[0][0][2] = fronts[0];
    cube[0][1][2] = fronts[1];
    cube[0][2][2] = fronts[2];
    //fronts
    cube[1][0][2] = bottoms[0];
    cube[1][1][2] = bottoms[1];
    cube[1][2][2] = bottoms[2];
    //bottoms
    cube[2][0][2] = backs[0];
    cube[2][1][2] = backs[1];
    cube[2][2][2] = backs[2];
    //backs
    cube[3][0][0] = tops[0];
    cube[3][1][0] = tops[1];
    cube[3][2][0] = tops[2];
    //rights
    cube[4][0][0] = rights[5]; //1
    cube[4][0][1] = rights[3]; //2
    cube[4][0][2] = rights[0]; //3
    cube[4][1][0] = rights[6]; //4

    cube[4][1][2] = rights[1]; //6
    cube[4][2][0] = rights[7]; //7
    cube[4][2][1] = rights[4]; //8
    cube[4][2][2] = rights[2]; //9

    sequenceHistory("R", x);
    _onload();

    if (showArrowDirection) {
        let topTurnPieces = document.getElementsByClassName('top')[0].children;
        topTurnPieces[2].innerHTML = '&uarr;';
        topTurnPieces[5].innerHTML = '&uarr;';
        topTurnPieces[8].innerHTML = '&uarr;';
        let frontTurnPieces = document.getElementsByClassName('front')[0].children;
        frontTurnPieces[2].innerHTML = '&uarr;';
        frontTurnPieces[5].innerHTML = '&uarr;';
        frontTurnPieces[8].innerHTML = '&uarr;';
        let bottomTurnPieces = document.getElementsByClassName('bottom')[0].children;
        bottomTurnPieces[2].innerHTML = '&uarr;';
        bottomTurnPieces[5].innerHTML = '&uarr;';
        bottomTurnPieces[8].innerHTML = '&uarr;';
        let backTurnPieces = document.getElementsByClassName('back')[0].children;
        backTurnPieces[0].innerHTML = '&darr;';
        backTurnPieces[3].innerHTML = '&darr;';
        backTurnPieces[6].innerHTML = '&darr;';
    }
    // document.querySelector("[data='w-9']").innerHTML = 'A';
}

function rightCounterClockwise(x) {
    let tops = [cube[0][0][2], cube[0][1][2], cube[0][2][2]];
    let fronts = [cube[1][0][2], cube[1][1][2], cube[1][2][2]];
    let bottoms = [cube[2][2][2], cube[2][1][2], cube[2][0][2]];
    let backs = [cube[3][2][0], cube[3][1][0], cube[3][0][0]];
    let rights = [cube[4][0][0], cube[4][0][1], cube[4][0][2], cube[4][1][0], cube[4][1][2], cube[4][2][0], cube[4][2][1], cube[4][2][2]];

    //tops
    cube[0][0][2] = backs[0];
    cube[0][1][2] = backs[1];
    cube[0][2][2] = backs[2];
    //fronts
    cube[1][0][2] = tops[0];
    cube[1][1][2] = tops[1];
    cube[1][2][2] = tops[2];
    //bottoms
    cube[2][0][2] = fronts[0];
    cube[2][1][2] = fronts[1];
    cube[2][2][2] = fronts[2];
    //backs
    cube[3][0][0] = bottoms[0];
    cube[3][1][0] = bottoms[1];
    cube[3][2][0] = bottoms[2];
    //rights
    cube[4][0][0] = rights[2]; //1
    cube[4][0][1] = rights[4]; //2
    cube[4][0][2] = rights[7]; //3
    cube[4][1][0] = rights[1]; //4
    cube[4][1][2] = rights[6]; //6
    cube[4][2][0] = rights[0]; //7
    cube[4][2][1] = rights[3]; //8
    cube[4][2][2] = rights[5]; //9

    sequenceHistory("R'", x);
    _onload();

    if (showArrowDirection) {
        let topTurnPieces = document.getElementsByClassName('top')[0].children;
        topTurnPieces[2].innerHTML = '&darr;';
        topTurnPieces[5].innerHTML = '&darr;';
        topTurnPieces[8].innerHTML = '&darr;';
        let frontTurnPieces = document.getElementsByClassName('front')[0].children;
        frontTurnPieces[2].innerHTML = '&darr;';
        frontTurnPieces[5].innerHTML = '&darr;';
        frontTurnPieces[8].innerHTML = '&darr;';
        let bottomTurnPieces = document.getElementsByClassName('bottom')[0].children;
        bottomTurnPieces[2].innerHTML = '&darr;';
        bottomTurnPieces[5].innerHTML = '&darr;';
        bottomTurnPieces[8].innerHTML = '&darr;';
        let backTurnPieces = document.getElementsByClassName('back')[0].children;
        backTurnPieces[0].innerHTML = '&uarr;';
        backTurnPieces[3].innerHTML = '&uarr;';
        backTurnPieces[6].innerHTML = '&uarr;';
    }
}

function leftClockwise(x) {
    let tops = [cube[0][0][0], cube[0][1][0], cube[0][2][0]];
    let fronts = [cube[1][0][0], cube[1][1][0], cube[1][2][0]];
    let bottoms = [cube[2][2][0], cube[2][1][0], cube[2][0][0]];
    let backs = [cube[3][2][2], cube[3][1][2], cube[3][0][2]];
    let lefts = [cube[5][0][0], cube[5][0][1], cube[5][0][2], cube[5][1][0], cube[5][1][2], cube[5][2][0], cube[5][2][1], cube[5][2][2]];

    //tops
    cube[0][0][0] = backs[0];
    cube[0][1][0] = backs[1];
    cube[0][2][0] = backs[2];
    //fronts
    cube[1][0][0] = tops[0];
    cube[1][1][0] = tops[1];
    cube[1][2][0] = tops[2];
    //bottoms
    cube[2][0][0] = fronts[0];
    cube[2][1][0] = fronts[1];
    cube[2][2][0] = fronts[2];
    //backs
    cube[3][0][2] = bottoms[0];
    cube[3][1][2] = bottoms[1];
    cube[3][2][2] = bottoms[2];

    //lefts
    cube[5][0][0] = lefts[5]; //1
    cube[5][0][1] = lefts[3]; //2
    cube[5][0][2] = lefts[0]; //3
    cube[5][1][0] = lefts[6]; //4
    cube[5][1][2] = lefts[1]; //6
    cube[5][2][0] = lefts[7]; //7
    cube[5][2][1] = lefts[4]; //8
    cube[5][2][2] = lefts[2]; //9

    sequenceHistory("L", x);
    _onload();

    if (showArrowDirection) {
        let topTurnPieces = document.getElementsByClassName('top')[0].children;
        topTurnPieces[0].innerHTML = '&darr;';
        topTurnPieces[3].innerHTML = '&darr;';
        topTurnPieces[6].innerHTML = '&darr;';
        let frontTurnPieces = document.getElementsByClassName('front')[0].children;
        frontTurnPieces[0].innerHTML = '&darr;';
        frontTurnPieces[3].innerHTML = '&darr;';
        frontTurnPieces[6].innerHTML = '&darr;';
        let backTurnPieces = document.getElementsByClassName('back')[0].children;
        backTurnPieces[2].innerHTML = '&uarr;';
        backTurnPieces[5].innerHTML = '&uarr;';
        backTurnPieces[8].innerHTML = '&uarr;';
        let bottomTurnPieces = document.getElementsByClassName('bottom')[0].children;
        bottomTurnPieces[0].innerHTML = '&darr;';
        bottomTurnPieces[3].innerHTML = '&darr;';
        bottomTurnPieces[6].innerHTML = '&darr;';
    }
}

function leftCounterClockwise(x) {
    let tops = [cube[0][2][0], cube[0][1][0], cube[0][0][0]];
    let fronts = [cube[1][0][0], cube[1][1][0], cube[1][2][0]];
    let bottoms = [cube[2][0][0], cube[2][1][0], cube[2][2][0]];
    let backs = [cube[3][2][2], cube[3][1][2], cube[3][0][2]];
    let rights = [cube[5][0][0], cube[5][0][1], cube[5][0][2], cube[5][1][0], cube[5][1][2], cube[5][2][0], cube[5][2][1], cube[5][2][2]];

    // //tops
    cube[0][0][0] = fronts[0];
    cube[0][1][0] = fronts[1];
    cube[0][2][0] = fronts[2];
    //fronts
    cube[1][0][0] = bottoms[0];
    cube[1][1][0] = bottoms[1];
    cube[1][2][0] = bottoms[2];
    //bottoms
    cube[2][0][0] = backs[0];
    cube[2][1][0] = backs[1];
    cube[2][2][0] = backs[2];
    //backs
    cube[3][0][2] = tops[0];
    cube[3][1][2] = tops[1];
    cube[3][2][2] = tops[2];

    //rights
    cube[5][0][0] = rights[2]; //1
    cube[5][0][1] = rights[4]; //2
    cube[5][0][2] = rights[7]; //3
    cube[5][1][0] = rights[1]; //4
    cube[5][1][2] = rights[6]; //6
    cube[5][2][0] = rights[0]; //7
    cube[5][2][1] = rights[3]; //8
    cube[5][2][2] = rights[5]; //9

    sequenceHistory("L'", x);
    _onload();

    if (showArrowDirection) {
        let topTurnPieces = document.getElementsByClassName('top')[0].children;
        topTurnPieces[0].innerHTML = '&uarr;';
        topTurnPieces[3].innerHTML = '&uarr;';
        topTurnPieces[6].innerHTML = '&uarr;';
        let frontTurnPieces = document.getElementsByClassName('front')[0].children;
        frontTurnPieces[0].innerHTML = '&uarr;';
        frontTurnPieces[3].innerHTML = '&uarr;';
        frontTurnPieces[6].innerHTML = '&uarr;';
        let backTurnPieces = document.getElementsByClassName('back')[0].children;
        backTurnPieces[2].innerHTML = '&darr;';
        backTurnPieces[5].innerHTML = '&darr;';
        backTurnPieces[8].innerHTML = '&darr;';
        let bottomTurnPieces = document.getElementsByClassName('bottom')[0].children;
        bottomTurnPieces[0].innerHTML = '&uarr;';
        bottomTurnPieces[3].innerHTML = '&uarr;';
        bottomTurnPieces[6].innerHTML = '&uarr;';
    }
}

function frontClockwise(x) {
    let tops = [cube[0][2][0], cube[0][2][1], cube[0][2][2]];
    let bottoms = [cube[2][0][0], cube[2][0][1], cube[2][0][2]];
    let lefts = [cube[5][2][2], cube[5][1][2], cube[5][0][2]];
    let rights = [cube[4][2][0], cube[4][1][0], cube[4][0][0]];
    let fronts = [cube[1][0][0], cube[1][0][1], cube[1][0][2], cube[1][1][0], cube[1][1][2], cube[1][2][0], cube[1][2][1], cube[1][2][2]];

    // tops
    cube[0][2][0] = lefts[0];
    cube[0][2][1] = lefts[1];
    cube[0][2][2] = lefts[2];
    //rights
    cube[4][0][0] = tops[0];
    cube[4][1][0] = tops[1];
    cube[4][2][0] = tops[2];
    //bottoms
    cube[2][0][0] = rights[0];
    cube[2][0][1] = rights[1];
    cube[2][0][2] = rights[2];
    //lefts
    cube[5][0][2] = bottoms[0];
    cube[5][1][2] = bottoms[1];
    cube[5][2][2] = bottoms[2];
    //fronts
    cube[1][0][0] = fronts[5]; //1
    cube[1][0][1] = fronts[3]; //2
    cube[1][0][2] = fronts[0]; //3
    cube[1][1][0] = fronts[6]; //4
    cube[1][1][2] = fronts[1]; //6
    cube[1][2][0] = fronts[7]; //7
    cube[1][2][1] = fronts[4]; //8
    cube[1][2][2] = fronts[2]; //9

    sequenceHistory("F", x);
    _onload();

    if (showArrowDirection) {
        let topTurnPieces = document.getElementsByClassName('top')[0].children;
        topTurnPieces[6].innerHTML = '&rarr;';
        topTurnPieces[7].innerHTML = '&rarr;';
        topTurnPieces[8].innerHTML = '&rarr;';
        let rightTurnPieces = document.getElementsByClassName('right')[0].children;
        rightTurnPieces[0].innerHTML = '&darr;';
        rightTurnPieces[3].innerHTML = '&darr;';
        rightTurnPieces[6].innerHTML = '&darr;';
        let leftTurnPieces = document.getElementsByClassName('left')[0].children;
        leftTurnPieces[2].innerHTML = '&uarr;';
        leftTurnPieces[5].innerHTML = '&uarr;';
        leftTurnPieces[8].innerHTML = '&uarr;';
        let bottomTurnPieces = document.getElementsByClassName('bottom')[0].children;
        bottomTurnPieces[0].innerHTML = '&larr;';
        bottomTurnPieces[1].innerHTML = '&larr;';
        bottomTurnPieces[2].innerHTML = '&larr;';
    }
}

function frontCounterClockwise(x) {
    let tops = [cube[0][2][2], cube[0][2][1], cube[0][2][0]];
    let bottoms = [cube[2][0][2], cube[2][0][1], cube[2][0][0]];
    let lefts = [cube[5][0][2], cube[5][1][2], cube[5][2][2]];
    let rights = [cube[4][0][0], cube[4][1][0], cube[4][2][0]];
    let fronts = [cube[1][0][0], cube[1][0][1], cube[1][0][2], cube[1][1][0], cube[1][1][2], cube[1][2][0], cube[1][2][1], cube[1][2][2]];

    // tops
    cube[0][2][0] = rights[0];
    cube[0][2][1] = rights[1];
    cube[0][2][2] = rights[2];
    //rights
    cube[4][0][0] = bottoms[0];
    cube[4][1][0] = bottoms[1];
    cube[4][2][0] = bottoms[2];
    //bottoms
    cube[2][0][0] = lefts[0];
    cube[2][0][1] = lefts[1];
    cube[2][0][2] = lefts[2];
    //lefts
    cube[5][0][2] = tops[0];
    cube[5][1][2] = tops[1];
    cube[5][2][2] = tops[2];
    //fronts
    cube[1][0][0] = fronts[2]; //1
    cube[1][0][1] = fronts[4]; //2
    cube[1][0][2] = fronts[7]; //3
    cube[1][1][0] = fronts[1]; //4

    cube[1][1][2] = fronts[6]; //6
    cube[1][2][0] = fronts[0]; //7
    cube[1][2][1] = fronts[3]; //8
    cube[1][2][2] = fronts[5]; //9

    sequenceHistory("F'", x);
    _onload();

    if (showArrowDirection) {
        let topTurnPieces = document.getElementsByClassName('top')[0].children;
        topTurnPieces[6].innerHTML = '&larr;';
        topTurnPieces[7].innerHTML = '&larr;';
        topTurnPieces[8].innerHTML = '&larr;';
        let rightTurnPieces = document.getElementsByClassName('right')[0].children;
        rightTurnPieces[0].innerHTML = '&uarr;';
        rightTurnPieces[3].innerHTML = '&uarr;';
        rightTurnPieces[6].innerHTML = '&uarr;';
        let leftTurnPieces = document.getElementsByClassName('left')[0].children;
        leftTurnPieces[2].innerHTML = '&darr;';
        leftTurnPieces[5].innerHTML = '&darr;';
        leftTurnPieces[8].innerHTML = '&darr;';
        let bottomTurnPieces = document.getElementsByClassName('bottom')[0].children;
        bottomTurnPieces[0].innerHTML = '&rarr;';
        bottomTurnPieces[1].innerHTML = '&rarr;';
        bottomTurnPieces[2].innerHTML = '&rarr;';
    }
}

function backClockwise(x) {
    let tops = [cube[0][0][2], cube[0][0][1], cube[0][0][0]];
    let bottoms = [cube[2][2][2], cube[2][2][1], cube[2][2][0]];
    let lefts = [cube[5][0][0], cube[5][1][0], cube[5][2][0]];
    let rights = [cube[4][0][2], cube[4][1][2], cube[4][2][2]];
    let backs = [cube[3][0][0], cube[3][0][1], cube[3][0][2], cube[3][1][0], cube[3][1][2], cube[3][2][0], cube[3][2][1], cube[3][2][2]];

    // tops
    cube[0][0][0] = rights[0];
    cube[0][0][1] = rights[1];
    cube[0][0][2] = rights[2];
    //rights
    cube[4][0][2] = bottoms[0];
    cube[4][1][2] = bottoms[1];
    cube[4][2][2] = bottoms[2];
    //bottoms
    cube[2][2][0] = lefts[0];
    cube[2][2][1] = lefts[1];
    cube[2][2][2] = lefts[2];
    //lefts
    cube[5][0][0] = tops[0];
    cube[5][1][0] = tops[1];
    cube[5][2][0] = tops[2];
    //fronts
    cube[3][0][0] = backs[5]; //1
    cube[3][0][1] = backs[3]; //2
    cube[3][0][2] = backs[0]; //3
    cube[3][1][0] = backs[6]; //4
    cube[3][1][2] = backs[1]; //6
    cube[3][2][0] = backs[7]; //7
    cube[3][2][1] = backs[4]; //8
    cube[3][2][2] = backs[2]; //9

    sequenceHistory("B", x);
    _onload();

    if (showArrowDirection) {
        let topTurnPieces = document.getElementsByClassName('top')[0].children;
        topTurnPieces[0].innerHTML = '&larr;';
        topTurnPieces[1].innerHTML = '&larr;';
        topTurnPieces[2].innerHTML = '&larr;';
        let rightTurnPieces = document.getElementsByClassName('right')[0].children;
        rightTurnPieces[2].innerHTML = '&uarr;';
        rightTurnPieces[5].innerHTML = '&uarr;';
        rightTurnPieces[8].innerHTML = '&uarr;';
        let leftTurnPieces = document.getElementsByClassName('left')[0].children;
        leftTurnPieces[0].innerHTML = '&darr;';
        leftTurnPieces[3].innerHTML = '&darr;';
        leftTurnPieces[6].innerHTML = '&darr;';
        let bottomTurnPieces = document.getElementsByClassName('bottom')[0].children;
        bottomTurnPieces[6].innerHTML = '&rarr;';
        bottomTurnPieces[7].innerHTML = '&rarr;';
        bottomTurnPieces[8].innerHTML = '&rarr;';
    }
}

function backCounterClockwise(x) {
    let tops = [cube[0][0][0], cube[0][0][1], cube[0][0][2]];
    let bottoms = [cube[2][2][0], cube[2][2][1], cube[2][2][2]];
    let lefts = [cube[5][2][0], cube[5][1][0], cube[5][0][0]];
    let rights = [cube[4][2][2], cube[4][1][2], cube[4][0][2]]; //
    let backs = [cube[3][0][0], cube[3][0][1], cube[3][0][2], cube[3][1][0], cube[3][1][2], cube[3][2][0], cube[3][2][1], cube[3][2][2]];

    // tops
    cube[0][0][0] = lefts[0];
    cube[0][0][1] = lefts[1];
    cube[0][0][2] = lefts[2];
    //rights
    cube[4][0][2] = tops[0];
    cube[4][1][2] = tops[1];
    cube[4][2][2] = tops[2];
    //bottoms
    cube[2][2][0] = rights[0];
    cube[2][2][1] = rights[1];
    cube[2][2][2] = rights[2];
    //lefts
    cube[5][0][0] = bottoms[0];
    cube[5][1][0] = bottoms[1];
    cube[5][2][0] = bottoms[2];
    //fronts
    cube[3][0][0] = backs[2]; //1
    cube[3][0][1] = backs[4]; //2
    cube[3][0][2] = backs[7]; //3
    cube[3][1][0] = backs[1]; //4
    cube[3][1][2] = backs[6]; //6
    cube[3][2][0] = backs[0]; //7
    cube[3][2][1] = backs[3]; //8
    cube[3][2][2] = backs[5]; //9

    sequenceHistory("B'", x);
    _onload();

    if (showArrowDirection) {
        let topTurnPieces = document.getElementsByClassName('top')[0].children;
        topTurnPieces[0].innerHTML = '&rarr;';
        topTurnPieces[1].innerHTML = '&rarr;';
        topTurnPieces[2].innerHTML = '&rarr;';
        let rightTurnPieces = document.getElementsByClassName('right')[0].children;
        rightTurnPieces[2].innerHTML = '&darr;';
        rightTurnPieces[5].innerHTML = '&darr;';
        rightTurnPieces[8].innerHTML = '&darr;';
        let leftTurnPieces = document.getElementsByClassName('left')[0].children;
        leftTurnPieces[0].innerHTML = '&uarr;';
        leftTurnPieces[3].innerHTML = '&uarr;';
        leftTurnPieces[6].innerHTML = '&uarr;';
        let bottomTurnPieces = document.getElementsByClassName('bottom')[0].children;
        bottomTurnPieces[6].innerHTML = '&larr;';
        bottomTurnPieces[7].innerHTML = '&larr;';
        bottomTurnPieces[8].innerHTML = '&larr;';
    }
}

function topClockwise(x) {
    let fronts = [cube[1][0][0], cube[1][0][1], cube[1][0][2]];
    let lefts = [cube[5][0][0], cube[5][0][1], cube[5][0][2]];
    let rights = [cube[4][0][0], cube[4][0][1], cube[4][0][2]];
    let backs = [cube[3][0][0], cube[3][0][1], cube[3][0][2]];
    let tops = [cube[0][0][0], cube[0][0][1], cube[0][0][2], cube[0][1][0], cube[0][1][2], cube[0][2][0], cube[0][2][1], cube[0][2][2]];

    //fronts
    cube[1][0][0] = rights[0];
    cube[1][0][1] = rights[1];
    cube[1][0][2] = rights[2];
    //lefts
    cube[5][0][0] = fronts[0];
    cube[5][0][1] = fronts[1];
    cube[5][0][2] = fronts[2];
    //backs
    cube[3][0][0] = lefts[0];
    cube[3][0][1] = lefts[1];
    cube[3][0][2] = lefts[2];
    //rights
    cube[4][0][0] = backs[0];
    cube[4][0][1] = backs[1];
    cube[4][0][2] = backs[2];
    //tops
    cube[0][0][0] = tops[5]; //1
    cube[0][0][1] = tops[3]; //2
    cube[0][0][2] = tops[0]; //3
    cube[0][1][0] = tops[6]; //4
    cube[0][1][2] = tops[1]; //6
    cube[0][2][0] = tops[7]; //7
    cube[0][2][1] = tops[4]; //8
    cube[0][2][2] = tops[2]; //9

    sequenceHistory("U", x);
    _onload();

    if (showArrowDirection) {
        let frontTurnPieces = document.getElementsByClassName('front')[0].children;
        frontTurnPieces[0].innerHTML = '&larr;';
        frontTurnPieces[1].innerHTML = '&larr;';
        frontTurnPieces[2].innerHTML = '&larr;';
        let rightTurnPieces = document.getElementsByClassName('right')[0].children;
        rightTurnPieces[0].innerHTML = '&larr;';
        rightTurnPieces[1].innerHTML = '&larr;';
        rightTurnPieces[2].innerHTML = '&larr;';
        let backTurnPieces = document.getElementsByClassName('back')[0].children;
        backTurnPieces[0].innerHTML = '&larr;';
        backTurnPieces[1].innerHTML = '&larr;';
        backTurnPieces[2].innerHTML = '&larr;';
        let leftTurnPieces = document.getElementsByClassName('left')[0].children;
        leftTurnPieces[0].innerHTML = '&larr;';
        leftTurnPieces[1].innerHTML = '&larr;';
        leftTurnPieces[2].innerHTML = '&larr;';
    }
}

function topCounterClockwise(x) {
    let fronts = [cube[1][0][0], cube[1][0][1], cube[1][0][2]];
    let lefts = [cube[5][0][0], cube[5][0][1], cube[5][0][2]];
    let rights = [cube[4][0][0], cube[4][0][1], cube[4][0][2]];
    let backs = [cube[3][0][0], cube[3][0][1], cube[3][0][2]];
    let tops = [cube[0][0][0], cube[0][0][1], cube[0][0][2], cube[0][1][0], cube[0][1][2], cube[0][2][0], cube[0][2][1], cube[0][2][2]];

    //fronts
    cube[1][0][0] = lefts[0];
    cube[1][0][1] = lefts[1];
    cube[1][0][2] = lefts[2];
    //lefts
    cube[5][0][0] = backs[0];
    cube[5][0][1] = backs[1];
    cube[5][0][2] = backs[2];
    //backs
    cube[3][0][0] = rights[0];
    cube[3][0][1] = rights[1];
    cube[3][0][2] = rights[2];
    //rights
    cube[4][0][0] = fronts[0];
    cube[4][0][1] = fronts[1];
    cube[4][0][2] = fronts[2];
    //tops
    cube[0][0][0] = tops[2]; //1
    cube[0][0][1] = tops[4]; //2
    cube[0][0][2] = tops[7]; //3
    cube[0][1][0] = tops[1]; //4
    cube[0][1][2] = tops[6]; //6
    cube[0][2][0] = tops[0]; //7
    cube[0][2][1] = tops[3]; //8
    cube[0][2][2] = tops[5]; //9

    sequenceHistory("U'", x);
    _onload();

    if (showArrowDirection) {
        let frontTurnPieces = document.getElementsByClassName('front')[0].children;
        frontTurnPieces[0].innerHTML = '&rarr;';
        frontTurnPieces[1].innerHTML = '&rarr;';
        frontTurnPieces[2].innerHTML = '&rarr;';
        let rightTurnPieces = document.getElementsByClassName('right')[0].children;
        rightTurnPieces[0].innerHTML = '&rarr;';
        rightTurnPieces[1].innerHTML = '&rarr;';
        rightTurnPieces[2].innerHTML = '&rarr;';
        let backTurnPieces = document.getElementsByClassName('back')[0].children;
        backTurnPieces[0].innerHTML = '&rarr;';
        backTurnPieces[1].innerHTML = '&rarr;';
        backTurnPieces[2].innerHTML = '&rarr;';
        let leftTurnPieces = document.getElementsByClassName('left')[0].children;
        leftTurnPieces[0].innerHTML = '&rarr;';
        leftTurnPieces[1].innerHTML = '&rarr;';
        leftTurnPieces[2].innerHTML = '&rarr;';
    }
}

function bottomClockwise(x) {
    let fronts = [cube[1][2][0], cube[1][2][1], cube[1][2][2]];
    let lefts = [cube[5][2][0], cube[5][2][1], cube[5][2][2]];
    let rights = [cube[4][2][0], cube[4][2][1], cube[4][2][2]];
    let backs = [cube[3][2][0], cube[3][2][1], cube[3][2][2]];
    let bottoms = [cube[2][0][0], cube[2][0][1], cube[2][0][2], cube[2][1][0], cube[2][1][2], cube[2][2][0], cube[2][2][1], cube[2][2][2]];

    //fronts
    cube[1][2][0] = lefts[0];
    cube[1][2][1] = lefts[1];
    cube[1][2][2] = lefts[2];
    //lefts
    cube[5][2][0] = backs[0];
    cube[5][2][1] = backs[1];
    cube[5][2][2] = backs[2];
    //backs
    cube[3][2][0] = rights[0];
    cube[3][2][1] = rights[1];
    cube[3][2][2] = rights[2];
    //rights
    cube[4][2][0] = fronts[0];
    cube[4][2][1] = fronts[1];
    cube[4][2][2] = fronts[2];
    //bottoms
    cube[2][0][0] = bottoms[5]; //1
    cube[2][0][1] = bottoms[3]; //2
    cube[2][0][2] = bottoms[0]; //3
    cube[2][1][0] = bottoms[6]; //4
    cube[2][1][2] = bottoms[1]; //6
    cube[2][2][0] = bottoms[7]; //7
    cube[2][2][1] = bottoms[4]; //8
    cube[2][2][2] = bottoms[2]; //9

    sequenceHistory("D", x);
    _onload();

    if (showArrowDirection) {
        let frontTurnPieces = document.getElementsByClassName('front')[0].children;
        frontTurnPieces[6].innerHTML = '&rarr;';
        frontTurnPieces[7].innerHTML = '&rarr;';
        frontTurnPieces[8].innerHTML = '&rarr;';
        let rightTurnPieces = document.getElementsByClassName('right')[0].children;
        rightTurnPieces[6].innerHTML = '&rarr;';
        rightTurnPieces[7].innerHTML = '&rarr;';
        rightTurnPieces[8].innerHTML = '&rarr;';
        let backTurnPieces = document.getElementsByClassName('back')[0].children;
        backTurnPieces[6].innerHTML = '&rarr;';
        backTurnPieces[7].innerHTML = '&rarr;';
        backTurnPieces[8].innerHTML = '&rarr;';
        let leftTurnPieces = document.getElementsByClassName('left')[0].children;
        leftTurnPieces[6].innerHTML = '&rarr;';
        leftTurnPieces[7].innerHTML = '&rarr;';
        leftTurnPieces[8].innerHTML = '&rarr;';
    }
}

function bottomCounterClockwise(x) {
    let fronts = [cube[1][2][0], cube[1][2][1], cube[1][2][2]];
    let lefts = [cube[5][2][0], cube[5][2][1], cube[5][2][2]];
    let rights = [cube[4][2][0], cube[4][2][1], cube[4][2][2]];
    let backs = [cube[3][2][0], cube[3][2][1], cube[3][2][2]];
    let bottoms = [cube[2][0][0], cube[2][0][1], cube[2][0][2], cube[2][1][0], cube[2][1][2], cube[2][2][0], cube[2][2][1], cube[2][2][2]];

    //fronts
    cube[1][2][0] = rights[0];
    cube[1][2][1] = rights[1];
    cube[1][2][2] = rights[2];
    //lefts
    cube[5][2][0] = fronts[0];
    cube[5][2][1] = fronts[1];
    cube[5][2][2] = fronts[2];
    //backs
    cube[3][2][0] = lefts[0];
    cube[3][2][1] = lefts[1];
    cube[3][2][2] = lefts[2];
    //rights
    cube[4][2][0] = backs[0];
    cube[4][2][1] = backs[1];
    cube[4][2][2] = backs[2];
    //bottoms
    cube[2][0][0] = bottoms[2]; //1
    cube[2][0][1] = bottoms[4]; //2
    cube[2][0][2] = bottoms[7]; //3
    cube[2][1][0] = bottoms[1]; //4
    cube[2][1][2] = bottoms[6]; //6
    cube[2][2][0] = bottoms[0]; //7
    cube[2][2][1] = bottoms[3]; //8
    cube[2][2][2] = bottoms[5]; //9

    sequenceHistory("D'", x);
    _onload();

    if (showArrowDirection) {
        let frontTurnPieces = document.getElementsByClassName('front')[0].children;
        frontTurnPieces[6].innerHTML = '&larr;';
        frontTurnPieces[7].innerHTML = '&larr;';
        frontTurnPieces[8].innerHTML = '&larr;';
        let rightTurnPieces = document.getElementsByClassName('right')[0].children;
        rightTurnPieces[6].innerHTML = '&larr;';
        rightTurnPieces[7].innerHTML = '&larr;';
        rightTurnPieces[8].innerHTML = '&larr;';
        let backTurnPieces = document.getElementsByClassName('back')[0].children;
        backTurnPieces[6].innerHTML = '&larr;';
        backTurnPieces[7].innerHTML = '&larr;';
        backTurnPieces[8].innerHTML = '&larr;';
        let leftTurnPieces = document.getElementsByClassName('left')[0].children;
        leftTurnPieces[6].innerHTML = '&larr;';
        leftTurnPieces[7].innerHTML = '&larr;';
        leftTurnPieces[8].innerHTML = '&larr;';
    }
}

function turnLeft() {
    y = y + 90;
    cubecontainer.style.transform = `rotateY(${y}deg) rotateZ(0deg) rotateX(${x}deg) translateZ(-00px)`;
}
function turnRight() {
    y = y - 90;
    cubecontainer.style.transform = `rotateY(${y}deg) rotateZ(0deg) rotateX(${x}deg) translateZ(-00px)`;
}
function turnUp() {
    x = x + 90;
    cubecontainer.style.transform = `rotateY(${y}deg) rotateZ(0deg) rotateX(${x}deg) translateZ(-00px)`;
}
function turnDown() {
    x = x - 90;
    cubecontainer.style.transform = `rotateY(${y}deg) rotateZ(0deg) rotateX(${x}deg) translateZ(-00px)`;
}
function turnReset() {
    x = 0;
    y = 0;
    cubecontainer.style.transform = `rotateY(${y}deg) rotateZ(0deg) rotateX(${x}deg) translateZ(0px)`;
}
//#endregion

function genScramble(x) {
    resetVariables();

    scramble = [];
    for (let i = 0; i < scrambleLength; i++) {
        let a = Math.floor(Math.random() * moves.length);
        scramble.push(moves[a]);
    }

    x.style.pointerEvents = 'none';
    x.style.opacity = .7;
    setTimeout(() => {
        x.style.pointerEvents = 'auto';
        x.style.opacity = 1;
    }, (scramble.length + 1) * spd * scrambleAnimation);

    for (let i = 0; i < scramble.length; i++) {
        setTimeout(() => {
            switch (scramble[i][0]) {
                case 'u':
                    scramble[i][1] == null ? topClockwise(true) : topCounterClockwise(true);
                    break;
                case 'd':
                    scramble[i][1] == null ? bottomClockwise(true) : bottomCounterClockwise(true);
                    break;
                case 'l':
                    scramble[i][1] == null ? leftClockwise(true) : leftCounterClockwise(true);
                    break;
                case 'r':
                    scramble[i][1] == null ? rightClockwise(true) : rightCounterClockwise(true);
                    break;
                case 'f':
                    scramble[i][1] == null ? frontClockwise(true) : frontCounterClockwise(true);
                    break;
                case 'b':
                    scramble[i][1] == null ? backClockwise(true) : backCounterClockwise(true);
                    break;
            }
        }, spd * i * scrambleAnimation);
    }
}
function ownScramble(x) {
    resetVariables();

    let customScramble = document.getElementById('customscramble').value;
    let scrambleArr = (customScramble.toUpperCase()).split(' ');

    x.style.pointerEvents = 'none';
    x.style.opacity = .7;
    setTimeout(() => {
        x.style.pointerEvents = 'auto';
        x.style.opacity = 1;
    }, (scrambleArr.length + 1) * spd * scrambleAnimation);

    for (let i = 0; i < scrambleArr.length; i++) {
        setTimeout(() => {
            switch (scrambleArr[i]) {
                case "U":
                    topClockwise(true);
                    break;
                case "U'":
                    topCounterClockwise(true);
                    break;
                case "U2":
                    for (let i = 0; i < 2; i++) {
                        topClockwise(true);
                    }
                    break;
                case "D":
                    bottomClockwise(true);
                    break;
                case "D'":
                    bottomCounterClockwise(true);
                    break;
                case "D2":
                    for (let i = 0; i < 2; i++) {
                        bottomClockwise(true);
                    }
                    break;
                case "L":
                    leftClockwise(true);
                    break;
                case "L'":
                    leftCounterClockwise(true);
                    break;
                case "L2":
                    for (let i = 0; i < 2; i++) {
                        leftClockwise(true);
                    }
                    break;
                case "R":
                    rightClockwise(true);
                    break;
                case "R'":
                    rightCounterClockwise(true);
                    break;
                case "R2":
                    for (let i = 0; i < 2; i++) {
                        rightClockwise(true);
                    }
                    break;
                case "F":
                    frontClockwise(true);
                    break;
                case "F'":
                    frontCounterClockwise(true);
                    break;
                case "F2":
                    for (let i = 0; i < 2; i++) {
                        frontClockwise(true);
                    }
                    break;
                case "B":
                    backClockwise(true);
                    break;
                case "B'":
                    backCounterClockwise(true);
                    break;
                case "B2":
                    for (let i = 0; i < 2; i++) {
                        backClockwise(true);
                    }
                    break;
                default:
                    alert('verkeerde input')
                    break;
            }
        }, spd * i * scrambleAnimation);
    }
}

//#region SOLVE CUBE ALGORITHMS
function solve() {
    solveBtn.style.pointerEvents = 'none';
    solveBtn.style.opacity = .7;
    //witte kruis solven
    if (!whiteCrossSolved) {
        //check of wit edge in front zit
        if (cube[1][0][1][0] == 'w') {
            console.log('front top')
            let color = cube[1][0][1][2];

            setTimeout(() => {
                frontClockwise();
            }, spd * 1);
            setTimeout(() => {
                rightCounterClockwise();
            }, spd * 2);
            setTimeout(() => {
                bottomCounterClockwise();
            }, spd * 3);
            setTimeout(() => {
                rightClockwise();
            }, spd * 4);

            setTimeout(() => { solveToWhiteEdge(color); }, spd * 5);
        }
        else if (cube[1][1][0][0] == 'w') {
            console.log('front left');
            let color = cube[1][1][0][2];

            setTimeout(() => {
                leftClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomClockwise();
            }, spd * 2);
            setTimeout(() => {
                leftCounterClockwise();
            }, spd * 3);

            setTimeout(() => { solveToWhiteEdge(color); }, spd * 4);
        }
        else if (cube[1][1][2][0] == 'w') {
            console.log('front right');
            let color = cube[1][1][2][2];

            setTimeout(() => {
                rightCounterClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomCounterClockwise();
            }, spd * 2);
            setTimeout(() => {
                rightClockwise();
            }, spd * 3);

            setTimeout(() => { solveToWhiteEdge(color); }, spd * 4);
        }
        else if (cube[1][2][1][0] == 'w') {
            console.log('front bottom');
            let color = cube[1][2][1][2];

            setTimeout(() => {
                bottomClockwise();
            }, spd * 1);
            setTimeout(() => {
                rightClockwise();
            }, spd * 2);
            setTimeout(() => {
                frontClockwise();
            }, spd * 3);
            setTimeout(() => {
                rightCounterClockwise();
            }, spd * 4);

            setTimeout(() => { solveToWhiteEdge(color); }, spd * 4);
        }
        //check of wit edge in right zit
        else if (cube[4][0][1][0] == 'w') {
            console.log('right top');
            let color = cube[4][0][1][2];

            setTimeout(() => {
                frontCounterClockwise();
            }, spd * 1);
            setTimeout(() => {
                rightCounterClockwise();
            }, spd * 2);
            setTimeout(() => {
                frontClockwise();
            }, spd * 3);
            setTimeout(() => {
                rightClockwise();
            }, spd * 4);

            setTimeout(() => { solveToWhiteEdge(color); }, spd * 5);
        }
        else if (cube[4][1][0][0] == 'w') {
            console.log('right left');
            let color = cube[4][1][0][2];

            setTimeout(() => {
                rightClockwise();
            }, spd * 1);
            setTimeout(() => {
                frontCounterClockwise();
            }, spd * 2);
            setTimeout(() => {
                rightCounterClockwise();
            }, spd * 3);
            setTimeout(() => {
                frontClockwise();
            }, spd * 4);

            setTimeout(() => { solveToWhiteEdge(color); }, spd * 5);
        }
        else if (cube[4][1][2][0] == 'w') {
            console.log('right right');
            let color = cube[4][1][2][2];

            setTimeout(() => {
                frontCounterClockwise();
            }, spd * 1);
            setTimeout(() => {
                rightCounterClockwise();
            }, spd * 2);
            setTimeout(() => {
                rightCounterClockwise();
            }, spd * 3);
            setTimeout(() => {
                frontClockwise();
            }, spd * 4);
            setTimeout(() => {
                rightClockwise();
            }, spd * 5);
            setTimeout(() => {
                rightClockwise();
            }, spd * 6);

            setTimeout(() => { solveToWhiteEdge(color); }, spd * 7);
        }
        else if (cube[4][2][1][0] == 'w') {
            console.log('right bottom');
            let color = cube[4][2][1][2];

            setTimeout(() => {
                frontCounterClockwise();
            }, spd * 1);
            setTimeout(() => {
                rightClockwise();
            }, spd * 2);
            setTimeout(() => {
                frontClockwise();
            }, spd * 3);
            setTimeout(() => {
                rightCounterClockwise();
            }, spd * 4);

            setTimeout(() => { solveToWhiteEdge(color); }, spd * 5);
        }
        //check of wit edge in back zit
        else if (cube[3][0][1][0] == 'w') {
            console.log('back top');
            let color = cube[3][0][1][2];

            setTimeout(() => {
                rightCounterClockwise();
            }, spd * 1);
            setTimeout(() => {
                backCounterClockwise();
            }, spd * 2);
            setTimeout(() => {
                rightClockwise();
            }, spd * 3);
            setTimeout(() => {
                bottomCounterClockwise();
            }, spd * 4);
            setTimeout(() => {
                backClockwise();
            }, spd * 5);

            setTimeout(() => { solveToWhiteEdge(color); }, spd * 6);
        }
        else if (cube[3][1][0][0] == 'w') {
            console.log('back left');
            let color = cube[3][1][0][2];

            setTimeout(() => {
                backClockwise();
            }, spd * 1);
            setTimeout(() => {
                rightCounterClockwise();
            }, spd * 2);
            setTimeout(() => {
                backCounterClockwise();
            }, spd * 3);
            setTimeout(() => {
                rightClockwise();
            }, spd * 4);
            setTimeout(() => {
                bottomCounterClockwise();
            }, spd * 5);

            setTimeout(() => { solveToWhiteEdge(color); }, spd * 6);
        }
        else if (cube[3][1][2][0] == 'w') {
            console.log('back right');
            let color = cube[3][1][2][2];

            setTimeout(() => {
                rightCounterClockwise();
            }, spd * 1);
            setTimeout(() => {
                backClockwise();
            }, spd * 2);
            setTimeout(() => {
                backClockwise();
            }, spd * 3);
            setTimeout(() => {
                rightClockwise();
            }, spd * 4);
            setTimeout(() => {
                backClockwise();
            }, spd * 5);
            setTimeout(() => {
                backClockwise();
            }, spd * 6);
            setTimeout(() => {
                bottomCounterClockwise();
            }, spd * 7);

            setTimeout(() => { solveToWhiteEdge(color); }, spd * 8);
        }
        else if (cube[3][2][1][0] == 'w') {
            console.log('back bottom');
            let color = cube[3][2][1][2];

            setTimeout(() => {
                rightCounterClockwise();
            }, spd * 1);
            setTimeout(() => {
                backClockwise();
            }, spd * 2);
            setTimeout(() => {
                rightClockwise();
            }, spd * 3);
            setTimeout(() => {
                backCounterClockwise();
            }, spd * 4);
            setTimeout(() => {
                bottomCounterClockwise();
            }, spd * 5);

            setTimeout(() => { solveToWhiteEdge(color); }, spd * 6);
        }
        //check of wit edge in left zit
        else if (cube[5][0][1][0] == 'w') {
            console.log('left top');
            let color = cube[5][0][1][2];

            setTimeout(() => {
                frontClockwise();
            }, spd * 1);
            setTimeout(() => {
                leftClockwise();
            }, spd * 2);
            setTimeout(() => {
                frontCounterClockwise();
            }, spd * 3);
            setTimeout(() => {
                leftCounterClockwise();
            }, spd * 4);

            setTimeout(() => { solveToWhiteEdge(color); }, spd * 5);
        }
        else if (cube[5][1][0][0] == 'w') {
            console.log('left left');
            let color = cube[5][1][0][2];

            setTimeout(() => {
                frontClockwise();
            }, spd * 1);
            setTimeout(() => {
                leftClockwise();
            }, spd * 2);
            setTimeout(() => {
                leftClockwise();
            }, spd * 3);
            setTimeout(() => {
                frontCounterClockwise();
            }, spd * 4);
            setTimeout(() => {
                leftClockwise();
            }, spd * 5);
            setTimeout(() => {
                leftClockwise();
            }, spd * 6);

            setTimeout(() => { solveToWhiteEdge(color); }, spd * 7);
        }
        else if (cube[5][1][2][0] == 'w') {
            console.log('left right');
            let color = cube[5][1][2][2];

            setTimeout(() => {
                leftCounterClockwise();
            }, spd * 1);
            setTimeout(() => {
                frontClockwise();
            }, spd * 2);
            setTimeout(() => {
                leftClockwise();
            }, spd * 3);
            setTimeout(() => {
                frontCounterClockwise();
            }, spd * 4);

            setTimeout(() => { solveToWhiteEdge(color); }, spd * 5);
        }
        else if (cube[5][2][1][0] == 'w') {
            console.log('left bottom');
            let color = cube[5][2][1][2];

            setTimeout(() => {
                frontClockwise();
            }, spd * 1);
            setTimeout(() => {
                leftCounterClockwise();
            }, spd * 2);
            setTimeout(() => {
                frontCounterClockwise();
            }, spd * 3);
            setTimeout(() => {
                leftClockwise();
            }, spd * 4);

            setTimeout(() => { solveToWhiteEdge(color); }, spd * 5);
        }

        //check of wit edge in bottom zit
        else if (cube[2][0][1][0] == 'w') {
            console.log('bottom top');
            let color = cube[2][0][1][2];

            setTimeout(() => { solveToWhiteEdge(color); }, spd * 1);
        }
        else if (cube[2][1][0][0] == 'w') {
            console.log('bottom left');
            let color = cube[2][1][0][2];

            setTimeout(() => {
                bottomClockwise();
            }, spd * 1);

            setTimeout(() => { solveToWhiteEdge(color); }, spd * 2);
        }
        else if (cube[2][1][2][0] == 'w') {
            console.log('bottom right');
            let color = cube[2][1][2][2];

            setTimeout(() => {
                bottomCounterClockwise();
            }, spd * 1);

            setTimeout(() => { solveToWhiteEdge(color); }, spd * 2);
        }
        else if (cube[2][2][1][0] == 'w') {
            console.log('bottom bottom');
            let color = cube[2][2][1][2];

            setTimeout(() => {
                bottomClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomClockwise();
            }, spd * 2);

            setTimeout(() => { solveToWhiteEdge(color); }, spd * 3);
        }

        //check of witte kruis is solved en anderszet de foute op begin positie voor agoritme
        else {
            checkWhiteCrossSolved();
        }
    }
    //witte hoeken solven
    else if (!whiteCornersSolved) {
        //check if wit zit in front corners
        if (cube[1][0][0][0] == 'w') {
            console.log('front lefttop')
            let color = cube[1][0][0][2];

            setTimeout(() => {
                leftClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomClockwise();
            }, spd * 2);
            setTimeout(() => {
                leftCounterClockwise();
            }, spd * 3);

            setTimeout(() => { solveToWhiteCorner(color); }, spd * 4);
        }
        else if (cube[1][0][2][0] == 'w') {
            console.log('front righttop')
            let color = cube[1][0][2][2];

            setTimeout(() => {
                rightCounterClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomCounterClockwise();
            }, spd * 2);
            setTimeout(() => {
                rightClockwise();
            }, spd * 3);
            setTimeout(() => {
                bottomClockwise();
            }, spd * 4);

            setTimeout(() => { solveToWhiteCorner(color); }, spd * 5);
        }
        else if (cube[1][2][0][0] == 'w') {
            console.log('front leftbottom')
            let color = cube[1][2][0][2];

            setTimeout(() => {
                bottomClockwise();
            }, spd * 1);

            setTimeout(() => { solveToWhiteCorner(color); }, spd * 2);
        }
        else if (cube[1][2][2][0] == 'w') {
            console.log('front leftbottom')
            let color = cube[1][2][2][2];

            setTimeout(() => { solveToWhiteCorner(color); }, spd * 1);
        }

        //check if wit zit in right corners
        else if (cube[4][0][0][0] == 'w') {
            console.log('right lefttop')
            let color = cube[4][0][0][2];

            setTimeout(() => {
                rightCounterClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomCounterClockwise();
            }, spd * 2);
            setTimeout(() => {
                rightClockwise();
            }, spd * 3);
            setTimeout(() => {
                bottomClockwise();
            }, spd * 4);

            setTimeout(() => { solveToWhiteCorner(color); }, spd * 5);
        }
        else if (cube[4][0][2][0] == 'w') {
            console.log('right righttop')
            let color = cube[4][0][2][2];

            setTimeout(() => {
                backCounterClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomCounterClockwise();
            }, spd * 2);
            setTimeout(() => {
                backClockwise();
            }, spd * 3);

            setTimeout(() => { solveToWhiteCorner(color); }, spd * 4);
        }
        else if (cube[4][2][0][0] == 'w') {
            console.log('right leftbottom')
            let color = cube[4][2][0][2];

            setTimeout(() => { solveToWhiteCorner(color); }, spd * 4);
        }
        else if (cube[4][2][2][0] == 'w') {
            console.log('right rightbottom')
            let color = cube[4][2][2][2];

            setTimeout(() => {
                bottomCounterClockwise();
            }, spd * 1);

            setTimeout(() => { solveToWhiteCorner(color); }, spd * 2);
        }
        //check if wit zit in back corners
        else if (cube[3][0][0][0] == 'w') {
            console.log('back lefttop')
            let color = cube[3][0][0][2];

            setTimeout(() => {
                backCounterClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomCounterClockwise();
            }, spd * 2);
            setTimeout(() => {
                backClockwise();
            }, spd * 3);

            setTimeout(() => { solveToWhiteCorner(color); }, spd * 4);
        }
        else if (cube[3][0][2][0] == 'w') {
            console.log('back righttop')
            let color = cube[3][0][2][2];

            setTimeout(() => {
                backClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomClockwise();
            }, spd * 2);
            setTimeout(() => {
                bottomClockwise();
            }, spd * 3);
            setTimeout(() => {
                backCounterClockwise();
            }, spd * 4);

            setTimeout(() => { solveToWhiteCorner(color); }, spd * 5);
        }
        else if (cube[3][2][0][0] == 'w') {
            console.log('back leftbottom')
            let color = cube[3][2][0][2];

            setTimeout(() => {
                bottomCounterClockwise();
            }, spd * 1);

            setTimeout(() => { solveToWhiteCorner(color); }, spd * 2);
        }
        else if (cube[3][2][2][0] == 'w') {
            console.log('back leftbottom')
            let color = cube[3][2][2][2];

            setTimeout(() => {
                bottomClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomClockwise();
            }, spd * 2);

            setTimeout(() => { solveToWhiteCorner(color); }, spd * 3);
        }
        //check if wit zit in left corners
        else if (cube[5][0][0][0] == 'w') {
            console.log('left lefttop')
            let color = cube[5][0][0][2];

            setTimeout(() => {
                backClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomClockwise();
            }, spd * 2);
            setTimeout(() => {
                bottomClockwise();
            }, spd * 3);
            setTimeout(() => {
                backCounterClockwise();
            }, spd * 4);

            setTimeout(() => { solveToWhiteCorner(color); }, spd * 5);
        }
        else if (cube[5][0][2][0] == 'w') {
            console.log('left righttop')
            let color = cube[5][0][2][2];

            setTimeout(() => {
                leftClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomClockwise();
            }, spd * 2);
            setTimeout(() => {
                leftCounterClockwise();
            }, spd * 3);

            setTimeout(() => { solveToWhiteCorner(color); }, spd * 4);
        }
        else if (cube[5][2][0][0] == 'w') {
            console.log('left leftbottom')
            let color = cube[5][2][0][2];

            setTimeout(() => {
                bottomClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomClockwise();
            }, spd * 2);

            setTimeout(() => { solveToWhiteCorner(color); }, spd * 3);
        }
        else if (cube[5][2][2][0] == 'w') {
            console.log('left rightbottom')
            let color = cube[5][2][2][2];

            setTimeout(() => {
                bottomClockwise();
            }, spd * 1);

            setTimeout(() => { solveToWhiteCorner(color); }, spd * 2);
        }
        //check if wit zit in bottom corners
        else if (cube[2][0][0][0] == 'w') {
            console.log('bottom lefttop')
            let color = cube[2][0][0][2];

            setTimeout(() => {
                bottomClockwise();
            }, spd * 1);

            setTimeout(() => { solveToWhiteCorner(color); }, spd * 2);
        }
        else if (cube[2][0][2][0] == 'w') {
            console.log('bottom righttop')
            let color = cube[2][0][2][2];

            setTimeout(() => { solveToWhiteCorner(color); }, spd * 1);
        }
        else if (cube[2][2][0][0] == 'w') {
            console.log('bottom leftbottom')
            let color = cube[2][2][0][2];

            setTimeout(() => {
                bottomClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomClockwise();
            }, spd * 2);

            setTimeout(() => { solveToWhiteCorner(color); }, spd * 3);
        }
        else if (cube[2][2][2][0] == 'w') {
            console.log('bottom rightbottom')
            let color = cube[2][2][2][2];

            setTimeout(() => {
                bottomCounterClockwise();
            }, spd * 1);

            setTimeout(() => { solveToWhiteCorner(color); }, spd * 2);
        }
        //check if wit zit in top corners maar op foute plek
        else if (cube[0][0][0] != 'w-1') {
            console.log('top lefttop')
            let color = cube[0][0][0][2];

            setTimeout(() => {
                leftCounterClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomClockwise();
            }, spd * 2);
            setTimeout(() => {
                bottomClockwise();
            }, spd * 3);
            setTimeout(() => {
                leftClockwise();
            }, spd * 4);

            setTimeout(() => { solveToWhiteCorner(color); }, spd * 5);
        }
        else if (cube[0][0][2] != 'w-3') {
            console.log('top righttop')
            let color = cube[0][0][2][2];

            setTimeout(() => {
                backCounterClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomCounterClockwise();
            }, spd * 2);
            setTimeout(() => {
                backClockwise();
            }, spd * 3);

            setTimeout(() => { solveToWhiteCorner(color); }, spd * 4);
        }
        else if (cube[0][2][0] != 'w-7') {
            console.log('top leftbottom')
            let color = cube[0][2][0][2];

            setTimeout(() => {
                leftClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomClockwise();
            }, spd * 2);
            setTimeout(() => {
                leftCounterClockwise();
            }, spd * 3);

            setTimeout(() => { solveToWhiteCorner(color); }, spd * 4);
        }
        else if (cube[0][2][2] != 'w-9') {
            console.log('top rightbottom')
            let color = cube[0][2][2][2];

            setTimeout(() => {
                rightCounterClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomCounterClockwise();
            }, spd * 2);
            setTimeout(() => {
                rightClockwise();
            }, spd * 3);
            setTimeout(() => {
                bottomClockwise();
            }, spd * 4);

            setTimeout(() => { solveToWhiteCorner(color); }, spd * 5);
        }

        else {
            whiteCornersSolved = true;
            solve();
        }
    }
    //tweede laag solven
    else if (!secondLayerSolved) {
        //als front onderaan midden geen geel vlak bevat
        if (cube[1][2][1][0] != 'y' && cube[2][0][1][0] != 'y') {
            console.log('geen geel')
            bottomTurnCount = 0;
            let color = cube[1][2][1];
            console.log(color);

            switch (color) {
                case 'g-4':
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 1);
                    setTimeout(() => {
                        leftClockwise();
                    }, spd * 2);
                    setTimeout(() => {
                        bottomCounterClockwise();
                    }, spd * 3);
                    setTimeout(() => {
                        leftCounterClockwise();
                    }, spd * 4);
                    setTimeout(() => {
                        bottomCounterClockwise();
                    }, spd * 5);
                    setTimeout(() => {
                        frontCounterClockwise();
                    }, spd * 6);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 7);
                    setTimeout(() => {
                        frontClockwise();
                    }, spd * 8);

                    setTimeout(() => {
                        solve();
                    }, spd * 9);
                    break;
                case 'g-6':
                    setTimeout(() => {
                        bottomCounterClockwise();
                    }, spd * 1);
                    setTimeout(() => {
                        rightCounterClockwise();
                    }, spd * 2);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 3);
                    setTimeout(() => {
                        rightClockwise();
                    }, spd * 4);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 5);
                    setTimeout(() => {
                        frontClockwise();
                    }, spd * 6);
                    setTimeout(() => {
                        bottomCounterClockwise();
                    }, spd * 7);
                    setTimeout(() => {
                        frontCounterClockwise();
                    }, spd * 8);

                    setTimeout(() => {
                        solve();
                    }, spd * 9);
                    break;
                case 'r-4':
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 1);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 2);
                    setTimeout(() => {
                        frontClockwise();
                    }, spd * 3);
                    setTimeout(() => {
                        bottomCounterClockwise();
                    }, spd * 4);
                    setTimeout(() => {
                        frontCounterClockwise();
                    }, spd * 5);
                    setTimeout(() => {
                        bottomCounterClockwise();
                    }, spd * 6);
                    setTimeout(() => {
                        rightCounterClockwise();
                    }, spd * 7);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 8);
                    setTimeout(() => {
                        rightClockwise();
                    }, spd * 9);

                    setTimeout(() => {
                        solve();
                    }, spd * 10);
                    break;
                case 'r-6':
                    setTimeout(() => {
                        backCounterClockwise();
                    }, spd * 1);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 2);
                    setTimeout(() => {
                        backClockwise();
                    }, spd * 3);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 4);
                    setTimeout(() => {
                        rightClockwise();
                    }, spd * 5);
                    setTimeout(() => {
                        bottomCounterClockwise();
                    }, spd * 6);
                    setTimeout(() => {
                        rightCounterClockwise();
                    }, spd * 7);

                    setTimeout(() => {
                        solve();
                    }, spd * 8);
                    break;
                case 'b-4':
                    setTimeout(() => {
                        bottomCounterClockwise();
                    }, spd * 1);
                    setTimeout(() => {
                        rightClockwise();
                    }, spd * 1);
                    setTimeout(() => {
                        bottomCounterClockwise();
                    }, spd * 1);
                    setTimeout(() => {
                        rightCounterClockwise();
                    }, spd * 1);
                    setTimeout(() => {
                        bottomCounterClockwise();
                    }, spd * 1);
                    setTimeout(() => {
                        backCounterClockwise();
                    }, spd * 1);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 1);
                    setTimeout(() => {
                        backClockwise();
                    }, spd * 1);
                    setTimeout(() => {
                        solve();
                    }, spd * 1);
                    break;
                case 'b-6':
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 1);

                    setTimeout(() => {
                        leftCounterClockwise();
                    }, spd * 2);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 3);
                    setTimeout(() => {
                        leftClockwise();
                    }, spd * 4);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 5);
                    setTimeout(() => {
                        backClockwise();
                    }, spd * 6);
                    setTimeout(() => {
                        bottomCounterClockwise();
                    }, spd * 7);
                    setTimeout(() => {
                        backCounterClockwise();
                    }, spd * 8);

                    setTimeout(() => {
                        solve();
                    }, spd * 9);
                    break;
                case 'o-4':
                    setTimeout(() => {
                        backClockwise();
                    }, spd * 1);
                    setTimeout(() => {
                        bottomCounterClockwise();
                    }, spd * 2);
                    setTimeout(() => {
                        backCounterClockwise();
                    }, spd * 3);
                    setTimeout(() => {
                        bottomCounterClockwise();
                    }, spd * 4);
                    setTimeout(() => {
                        leftCounterClockwise();
                    }, spd * 5);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 6);
                    setTimeout(() => {
                        leftClockwise();
                    }, spd * 7);

                    setTimeout(() => {
                        solve();
                    }, spd * 8);
                    break;
                case 'o-6':
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 1);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 2);
                    setTimeout(() => {
                        frontCounterClockwise();
                    }, spd * 3);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 4);
                    setTimeout(() => {
                        frontClockwise();
                    }, spd * 5);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 6);
                    setTimeout(() => {
                        leftClockwise();
                    }, spd * 7);
                    setTimeout(() => {
                        bottomCounterClockwise();
                    }, spd * 8);
                    setTimeout(() => {
                        leftCounterClockwise();
                    }, spd * 9);

                    setTimeout(() => {
                        solve();
                    }, spd * 10);
                    break;
                default:
                    console.log('second layer default switch statement')
                    break;
            }
        }
        else {
            console.log('wel geel')
            //draai onderste laag door als het geel bevat
            if (bottomTurnCount < 4) {
                setTimeout(() => {
                    bottomClockwise();
                    bottomTurnCount++;
                }, spd * 1);
                setTimeout(() => {
                    solve();
                }, spd * 2);
            }
            else {
                console.log("alles is geel!");
                if (cube[1][1][0] != 'g-4') {
                    console.log('spiegelbeeld f-1-0');
                    bottomTurnCount = 0;

                    setTimeout(() => {
                        leftClockwise();
                    }, spd * 1);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 2);
                    setTimeout(() => {
                        leftCounterClockwise();
                    }, spd * 3);
                    setTimeout(() => {
                        bottomCounterClockwise();
                    }, spd * 4);
                    setTimeout(() => {
                        frontCounterClockwise();
                    }, spd * 5);
                    setTimeout(() => {
                        bottomCounterClockwise();
                    }, spd * 6);
                    setTimeout(() => {
                        frontClockwise();
                    }, spd * 7);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 8);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 9);

                    setTimeout(() => {
                        solve();
                    }, spd * 10);

                    console.log('done');
                }
                else if (cube[1][1][2] != 'g-6') {
                    console.log('spiegelbeeld f-1-2');
                    bottomTurnCount = 0;

                    setTimeout(() => {
                        rightCounterClockwise();
                    }, spd * 1);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 2);
                    setTimeout(() => {
                        rightClockwise();
                    }, spd * 3);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 4);
                    setTimeout(() => {
                        frontClockwise();
                    }, spd * 5);
                    setTimeout(() => {
                        bottomCounterClockwise();
                    }, spd * 6);
                    setTimeout(() => {
                        frontCounterClockwise();
                    }, spd * 7);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 8);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 9);

                    setTimeout(() => {
                        solve();
                    }, spd * 10);
                }
                else if (cube[3][1][0] != 'b-4') {
                    console.log('spiegelbeeld b-1-0');
                    bottomTurnCount = 0;

                    setTimeout(() => {
                        backCounterClockwise();
                    }, spd * 1);
                    setTimeout(() => {
                        bottomCounterClockwise();
                    }, spd * 2);
                    setTimeout(() => {
                        backClockwise();
                    }, spd * 3);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 4);
                    setTimeout(() => {
                        rightClockwise();
                    }, spd * 5);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 6);
                    setTimeout(() => {
                        rightCounterClockwise();
                    }, spd * 7);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 8);

                    setTimeout(() => {
                        solve();
                    }, spd * 9);
                }
                else if (cube[3][1][2] != 'b-6') {
                    console.log('spiegelbeeld b-1-2');
                    bottomTurnCount = 0;

                    setTimeout(() => {
                        backClockwise();
                    }, spd * 1);
                    setTimeout(() => {
                        bottomClockwise();
                    }, spd * 2);
                    setTimeout(() => {
                        backCounterClockwise();
                    }, spd * 3);
                    setTimeout(() => {
                        bottomCounterClockwise();
                    }, spd * 4);
                    setTimeout(() => {
                        leftCounterClockwise();
                    }, spd * 5);
                    setTimeout(() => {
                        bottomCounterClockwise();
                    }, spd * 6);
                    setTimeout(() => {
                        leftClockwise();
                    }, spd * 7);
                    setTimeout(() => {
                        bottomCounterClockwise();
                    }, spd * 8);

                    setTimeout(() => {
                        solve();
                    }, spd * 9);
                }
                else {
                    console.log('DONE!');
                    secondLayerSolved = true;
                    solve();
                }
            }
        }
    }
    //gele kruis solven
    else if (!yellowCrossSolved) {
        //als gele kruis al er is
        if (cube[2][0][1][0] == 'y' && cube[2][2][1][0] == 'y' && cube[2][1][0][0] == 'y' && cube[2][1][2][0] == 'y') {
            console.log('geel kruis meteen af')
            yellowCrossSolved = true;
            solve();
        }
        //als alleen mid mid geel is
        else if (cube[2][0][1][0] != 'y' && cube[2][1][0][0] != 'y' && cube[2][1][2][0] != 'y') {
            console.log('alleen mid mid yellow');
            setTimeout(() => {
                makeYellowCross('mid');
            }, spd * 1);
        }
        //als gele stripe heeft
        else if ((cube[2][0][1][0] == 'y' && cube[2][2][1][0] == 'y') || (cube[2][1][0][0] == 'y' && cube[2][1][2][0] == 'y')) {
            console.log('yellow stripe');
            //check is stripe is horizontal or vertical
            if (cube[2][0][1][0] == 'y' && cube[2][2][1][0] == 'y') {
                setTimeout(() => {
                    bottomClockwise();
                }, spd * 1);
                setTimeout(() => {
                    makeYellowCross('stripe');
                }, spd * 2);
            }
            else {
                setTimeout(() => {
                    makeYellowCross('stripe');
                }, spd * 1);
            }
        }
        //als gele corner, draai deze goeie richting op
        else {
            console.log('yellow corner');
            if (cube[2][1][2][0] != 'y' && cube[2][2][1][0] != 'y') {
                setTimeout(() => {
                    makeYellowCross('corner');
                }, spd * 1);
            }
            else if (cube[2][1][0][0] != 'y' && cube[2][2][1][0] != 'y') {
                setTimeout(() => {
                    bottomCounterClockwise();
                }, spd * 1);
                setTimeout(() => {
                    makeYellowCross('corner');
                }, spd * 2);
            }
            else if (cube[2][1][0][0] != 'y' && cube[2][0][1][0] != 'y') {
                setTimeout(() => {
                    bottomClockwise();
                }, spd * 1);
                setTimeout(() => {
                    bottomClockwise();
                }, spd * 2);
                setTimeout(() => {
                    makeYellowCross('corner');
                }, spd * 3);
            }
            else if (cube[2][1][2][0] != 'y' && cube[2][0][1][0] != 'y') {
                setTimeout(() => {
                    bottomClockwise();
                }, spd * 1);
                setTimeout(() => {
                    makeYellowCross('corner');
                }, spd * 2);
            }
        }
    }
    //gele kruis alignen met zijkanten
    else if (!yellowCrossAligned) {
        checkAlignment();
    }
    else {
        alert('einde van mijn algoritme (ALL)')
    }
}

function solveToWhiteEdge(color) {
    switch (color) {
        case "2":
            setTimeout(() => {
                bottomClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomClockwise();
            }, spd * 2);
            setTimeout(() => {
                backClockwise();
            }, spd * 3);
            setTimeout(() => {
                backClockwise();
            }, spd * 4);

            setTimeout(() => { solve(); }, spd * 5);
            break;
        case "4":
            setTimeout(() => {
                bottomCounterClockwise();
            }, spd * 1);
            setTimeout(() => {
                leftClockwise();
            }, spd * 2);
            setTimeout(() => {
                leftClockwise();
            }, spd * 3);

            setTimeout(() => { solve(); }, spd * 4);
            break;
        case "6":
            setTimeout(() => {
                bottomClockwise();
            }, spd * 1);
            setTimeout(() => {
                rightClockwise();
            }, spd * 2);
            setTimeout(() => {
                rightClockwise();
            }, spd * 3);

            setTimeout(() => { solve(); }, spd * 4);
            break;
        case "8":
            setTimeout(() => {
                frontClockwise();
            }, spd * 1);
            setTimeout(() => {
                frontClockwise();
            }, spd * 2);

            setTimeout(() => { solve(); }, spd * 3);
            break;
    }
}
function checkWhiteCrossSolved() {
    if (cube[0][0][1][2] != '2') {
        console.log('top top');

        setTimeout(() => {
            backClockwise();
        }, spd * 1);
        setTimeout(() => {
            backClockwise();
        }, spd * 2);
        setTimeout(() => {
            bottomClockwise();
        }, spd * 3);
        setTimeout(() => {
            bottomClockwise();
        }, spd * 4);

        setTimeout(() => { solve(); }, spd * 5);
    }
    else if (cube[0][1][0][2] != '4') {
        console.log('top left');

        setTimeout(() => {
            leftClockwise();
        }, spd * 1);
        setTimeout(() => {
            leftClockwise();
        }, spd * 2);
        setTimeout(() => {
            bottomClockwise();
        }, spd * 3);

        setTimeout(() => { solve(); }, spd * 4);
    }
    else if (cube[0][1][2][2] != '6') {
        console.log('top right');

        setTimeout(() => {
            rightClockwise();
        }, spd * 1);
        setTimeout(() => {
            rightClockwise();
        }, spd * 2);
        setTimeout(() => {
            bottomCounterClockwise();
        }, spd * 3);

        setTimeout(() => { solve(); }, spd * 4);
    }
    else if (cube[0][2][1][2] != '8') {
        console.log('top right');

        setTimeout(() => {
            frontClockwise();
        }, spd * 1);
        setTimeout(() => {
            frontClockwise();
        }, spd * 2);

        setTimeout(() => { solve(); }, spd * 3);
    }
    else {
        whiteCrossSolved = true;
        solve();
    }
}

function solveToWhiteCorner(color) {
    switch (color) {
        case '1':
            console.log('preWhile1')
            setTimeout(() => {
                bottomClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomClockwise();
            }, spd * 2);

            setTimeout(() => {
                whileWhiteCorner(color);
            }, spd * 3);
            break;
        case '3':
            console.log('preWhile3')
            setTimeout(() => {
                bottomClockwise();
            }, spd * 1);

            setTimeout(() => {
                whileWhiteCorner(color);
            }, spd * 2);
            break;
        case '7':
            console.log('preWhile7')
            setTimeout(() => {
                bottomCounterClockwise();
            }, spd * 1);

            setTimeout(() => {
                whileWhiteCorner(color);
            }, spd * 2);
            break;
        case '9':
            console.log('preWhile9')
            setTimeout(() => {
                whileWhiteCorner(color);
            }, spd * 1);
            break;
    }
}

function whileWhiteCorner(x) {
    switch (x) {
        case '1':
            console.log('while1')
            setTimeout(() => {
                leftCounterClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomCounterClockwise();
            }, spd * 2);
            setTimeout(() => {
                leftClockwise();
            }, spd * 3);
            setTimeout(() => {
                bottomClockwise();
            }, spd * 4);
            setTimeout(() => {
                if (cube[0][0][0] != 'w-1') {
                    whileWhiteCorner(x);
                }
                else {
                    solve();
                }
            }, spd * 5);
            break;
        case '3':
            console.log('while3')
            setTimeout(() => {
                rightClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomClockwise();
            }, spd * 2);
            setTimeout(() => {
                rightCounterClockwise();
            }, spd * 3);
            setTimeout(() => {
                bottomCounterClockwise();
            }, spd * 4);
            setTimeout(() => {
                if (cube[0][0][2] != 'w-3') {
                    whileWhiteCorner(x);
                }
                else {
                    solve();
                }
            }, spd * 5);
            break;
        case '7':
            console.log('while7')
            setTimeout(() => {
                leftClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomClockwise();
            }, spd * 2);
            setTimeout(() => {
                leftCounterClockwise();
            }, spd * 3);
            setTimeout(() => {
                bottomCounterClockwise();
            }, spd * 4);
            setTimeout(() => {
                if (cube[0][2][0] != 'w-7') {
                    whileWhiteCorner(x);
                }
                else {
                    solve();
                }
            }, spd * 5);
            break;
        case '9':
            console.log('while9')
            setTimeout(() => {
                rightCounterClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomCounterClockwise();
            }, spd * 2);
            setTimeout(() => {
                rightClockwise();
            }, spd * 3);
            setTimeout(() => {
                bottomClockwise();
            }, spd * 4);
            setTimeout(() => {
                if (cube[0][2][2] != 'w-9') {
                    whileWhiteCorner(x);
                }
                else {
                    solve();
                }
            }, spd * 5);
            break;
    }
}

function makeYellowCross(x) {
    setTimeout(() => {
        frontClockwise();
    }, spd * 1);
    setTimeout(() => {
        leftClockwise();
    }, spd * 2);
    setTimeout(() => {
        bottomClockwise();
    }, spd * 3);
    setTimeout(() => {
        leftCounterClockwise();
    }, spd * 4);
    setTimeout(() => {
        bottomCounterClockwise();
    }, spd * 5);
    setTimeout(() => {
        frontCounterClockwise();
    }, spd * 6);

    setTimeout(() => {
        if (x == 'mid') {
            makeYellowCross('corner');
        }
        else if (x == 'corner') {
            setTimeout(() => {
                bottomClockwise();
            }, spd * 1);
            setTimeout(() => {
                makeYellowCross('stripe');
            }, spd * 2);
        }
        //nu is de kruis af
        else if (x == 'stripe') {
            console.log('kruis is af')
            yellowCrossSolved = true;
            solve();
        }
    }, spd * 7);
}

function checkAlignment() {
    //check of alles aligned
    if (cube[2][0][1] == 'y-2' && cube[2][1][0] == 'y-4' && cube[2][1][2] == 'y-6') {
        turnYellowCross();
    }
    else if (cube[2][0][1] == 'y-4' && cube[2][1][0] == 'y-8' && cube[2][1][2] == 'y-2') {
        setTimeout(() => {
            bottomCounterClockwise();
        }, spd * 1);
        turnYellowCross();
    }
    else if (cube[2][0][1] == 'y-8' && cube[2][1][0] == 'y-6' && cube[2][1][2] == 'y-4') {
        setTimeout(() => {
            bottomClockwise();
        }, spd * 1);
        setTimeout(() => {
            bottomClockwise();
        }, spd * 2);
        turnYellowCross();
    }
    else if (cube[2][0][1] == 'y-6' && cube[2][1][0] == 'y-2' && cube[2][1][2] == 'y-8') {
        setTimeout(() => {
            bottomClockwise();
        }, spd * 1);
        turnYellowCross();
    }

    //als verticaal streep aligned is
    else if (cube[2][0][1] == 'y-2' && cube[2][2][1] == 'y-8') {
        setTimeout(() => {
            bottomClockwise();
        }, spd * 1);
        setTimeout(() => {
            solveYellowAlignment('stripe');
        }, spd * 2);
        console.log('verticaal aligned')
    }
    //als horizontaal streep aligned is
    else if (cube[2][1][0] == 'y-4' && cube[2][1][2] == 'y-6') {
        setTimeout(() => {
            solveYellowAlignment('stripe');
        }, spd * 1);
        console.log('horizontaal aligned')
    }
    //draaid onderkant en run check again
    else if (!checkAlignmentSecondCheck) {
        console.log('check again');
        checkAlignmentSecondCheck = true;
        setTimeout(() => {
            bottomClockwise();
        }, spd * 1);
        setTimeout(() => {
            checkAlignment();
        }, spd * 2);
    }

    //corneralignment
    else {
        console.log('corner yellow unalignment');

        setTimeout(() => {
            findYellowCornerAlignment();
        }, spd * 1);
    }


}

function solveYellowAlignment(x) {
    setTimeout(() => {
        leftClockwise();
    }, spd * 1);
    setTimeout(() => {
        bottomClockwise();
    }, spd * 2);
    setTimeout(() => {
        leftCounterClockwise();
    }, spd * 3);
    setTimeout(() => {
        bottomClockwise();
    }, spd * 4);
    setTimeout(() => {
        leftClockwise();
    }, spd * 5);
    setTimeout(() => {
        bottomClockwise();
    }, spd * 6);
    setTimeout(() => {
        bottomClockwise();
    }, spd * 7);
    setTimeout(() => {
        leftCounterClockwise();
    }, spd * 8);

    //als vert of hor alignment 2keer moet
    setTimeout(() => {
        if (x == 'stripe') {
            setTimeout(() => {
                bottomCounterClockwise();
            }, spd * 1);
            setTimeout(() => {
                solveYellowAlignment();
            }, spd * 2);
        }
        else {
            //draai bottom tot kleuren matchen aan zijkanten
            console.log('draai bottom');
            turnYellowCross();
        }
    }, spd * 9);

}

function findYellowCornerAlignment() {
    let frt = cube[2][0][1]; //green
    let lft = cube[2][1][0]; //orange

    switch (frt) {
        //groen
        case 'y-2':
            if (lft == 'y-4') {
                yellowCornerFound = true;
                console.log('groen oranje')

                setTimeout(() => {
                    bottomCounterClockwise();
                }, spd * 1);
                setTimeout(() => {
                    solveYellowAlignment();
                }, spd * 2);
            }
            break;
        //oranje
        case 'y-4':
            if (lft == 'y-8') {
                yellowCornerFound = true;
                console.log('oranje blauw');

                setTimeout(() => {
                    bottomCounterClockwise();
                }, spd * 1);
                setTimeout(() => {
                    solveYellowAlignment('corner');
                }, spd * 2);
            }
            break;
        //rood
        case 'y-6':
            if (lft == 'y-2') {
                yellowCornerFound = true;
                console.log('rood groen');

                setTimeout(() => {
                    bottomCounterClockwise();
                }, spd * 1);
                setTimeout(() => {
                    solveYellowAlignment('corner');
                }, spd * 2);
            }
            break;
        //blauw
        case 'y-8':
            if (lft == 'y-6') {
                yellowCornerFound = true;
                console.log('blauw rood');

                setTimeout(() => {
                    bottomCounterClockwise();
                }, spd * 1);
                setTimeout(() => {
                    solveYellowAlignment('corner');
                }, spd * 2);
            }
            break;
    }

    if (!yellowCornerFound) {
        console.log('turn for yellow alignmentCheck')
        setTimeout(() => {
            bottomClockwise();
        }, spd * 1);
        setTimeout(() => {
            findYellowCornerAlignment();
        }, spd * 2);
    }
}

function turnYellowCross() {
    if (cube[2][0][1] == 'y-2') {
        checkYellowCornerAlignment();
    }
    else {
        setTimeout(() => {
            bottomClockwise();
        }, spd * 1);
        setTimeout(() => {
            turnYellowCross();
        }, spd * 2);
    }
}

function checkYellowCornerAlignment() {
    let yone = cube[2][0][0];
    let ythree = cube[2][0][2];
    let yseven = cube[2][2][0];
    let ynine = cube[2][2][2];
    ygo = false;
    ygr = false;
    ybo = false;
    ybr = false;


    if (yone == 'y-1' || yone == 'g-7' || yone == 'o-9') {
        console.log('yellow green orange')
        goodYellowCorners++;
        ygo = true;
    }
    if (ythree == 'y-3' || ythree == 'g-9' || ythree == 'r-7') {
        console.log('yellow red green')
        goodYellowCorners++;
        ygr = true;
    }
    if (yseven == 'y-7' || yseven == 'o-7' || yseven == 'b-9') {
        console.log('yellow orange blue')
        goodYellowCorners++;
        ybo = true;
    }
    if (ynine == 'y-9' || ynine == 'b-7' || ynine == 'r-9') {
        console.log('yellow red blue')
        goodYellowCorners++;
        ybr = true;
    }

    if (goodYellowCorners == 4) {
        console.log('corners klaar!!!!')
        rotateYellowCorners();
    }
    else {
        if (ygo) {
            console.log('ygo')
            //R F' U B F2 L' F2 R2 B' R F2 R' F2 L' D2 U' R' U' R' D2 R F2 D L2 R B' F U B' F'
        }
        else if (ygr) {
            console.log('ygr')
            setTimeout(() => {
                bottomCounterClockwise();
            }, spd * 1);
        }
        else if (ybo) {
            console.log('ybo')
            setTimeout(() => {
                bottomClockwise();
            }, spd * 1);
        }
        else if (ybr) {
            console.log('ybr')
            setTimeout(() => {
                bottomClockwise();
            }, spd * 1);
            setTimeout(() => {
                bottomClockwise();
            }, spd * 2);
        }

        setTimeout(() => {
            solveYellowCornerAlignment();
        }, spd * 3);
    }
}

function solveYellowCornerAlignment() {
    goodYellowCorners = 0;
    setTimeout(() => {
        bottomClockwise();
    }, spd * 1);
    setTimeout(() => {
        leftClockwise();
    }, spd * 2);
    setTimeout(() => {
        bottomCounterClockwise();
    }, spd * 3);
    setTimeout(() => {
        rightCounterClockwise();
    }, spd * 4);
    setTimeout(() => {
        bottomClockwise();
    }, spd * 5);
    setTimeout(() => {
        leftCounterClockwise();
    }, spd * 6);
    setTimeout(() => {
        bottomCounterClockwise();
    }, spd * 7);
    setTimeout(() => {
        rightClockwise();
    }, spd * 8);


    //draai terug
    if (ygo) {
        console.log('ygo rev')
        //R F' U B F2 L' F2 R2 B' R F2 R' F2 L' D2 U' R' U' R' D2 R F2 D L2 R B' F U B' F'
    }
    else if (ygr) {
        console.log('ygr rev')
        setTimeout(() => {
            bottomClockwise();
        }, spd * 9);
    }
    else if (ybo) {
        console.log('ybo rev')
        setTimeout(() => {
            bottomCounterClockwise();
        }, spd * 9);
    }
    else if (ybr) {
        console.log('ybr rev')
        setTimeout(() => {
            bottomClockwise();
        }, spd * 9);
        setTimeout(() => {
            bottomClockwise();
        }, spd * 10);
    }


    setTimeout(() => {
        checkYellowCornerAlignment();
    }, spd * 11);
}

function rotateYellowCorners() {
    console.log('DONE');
    solveYGO();
}

function solveYGO() {
    if (cube[2][0][0] != 'y-1') {
        setTimeout(() => {
            leftCounterClockwise();
        }, spd * 1);
        setTimeout(() => {
            topCounterClockwise();
        }, spd * 2);
        setTimeout(() => {
            leftClockwise();
        }, spd * 3);
        setTimeout(() => {
            topClockwise();
        }, spd * 4);
        setTimeout(() => {
            solveYGO();
        }, spd * 5);
    }
    else {
        setTimeout(() => {
            bottomClockwise();
        }, spd * 1);
        setTimeout(() => {
            solveYBO();
        }, spd * 2);
    }
}

function solveYBO() {
    if (cube[2][0][0] != 'y-7') {
        setTimeout(() => {
            leftCounterClockwise();
        }, spd * 1);
        setTimeout(() => {
            topCounterClockwise();
        }, spd * 2);
        setTimeout(() => {
            leftClockwise();
        }, spd * 3);
        setTimeout(() => {
            topClockwise();
        }, spd * 4);
        setTimeout(() => {
            solveYBO();
        }, spd * 5);
    }
    else {
        setTimeout(() => {
            bottomClockwise();
        }, spd * 1);
        setTimeout(() => {
            solveYBR();
        }, spd * 2);
    }
}

function solveYBR() {
    if (cube[2][0][0] != 'y-9') {
        setTimeout(() => {
            leftCounterClockwise();
        }, spd * 1);
        setTimeout(() => {
            topCounterClockwise();
        }, spd * 2);
        setTimeout(() => {
            leftClockwise();
        }, spd * 3);
        setTimeout(() => {
            topClockwise();
        }, spd * 4);
        setTimeout(() => {
            solveYBR();
        }, spd * 5);
    }
    else {
        setTimeout(() => {
            bottomClockwise();
        }, spd * 1);
        setTimeout(() => {
            solveYGR();
        }, spd * 2);
    }
}

function solveYGR() {
    if (cube[2][0][0] != 'y-3') {
        setTimeout(() => {
            leftCounterClockwise();
        }, spd * 1);
        setTimeout(() => {
            topCounterClockwise();
        }, spd * 2);
        setTimeout(() => {
            leftClockwise();
        }, spd * 3);
        setTimeout(() => {
            topClockwise();
        }, spd * 4);
        setTimeout(() => {
            solveYGR();
        }, spd * 5);
    }
    else {
        setTimeout(() => {
            bottomClockwise();
        }, spd * 1);
        setTimeout(() => {
            Done();
        }, spd * 2);
    }
}

function Done() {
    console.log('CUBE SOLVED!');
    solveBtn.style.pointerEvents = 'auto';
    solveBtn.style.opacity = 1;

    scrambleHistorySequence = [];

    makeSolveSequenceEfficient();
}
//#endregion

function makeSolveSequenceEfficient() {
    let solveMoves = arrHistorySequence;
    let count = 0;

    let duplicate = null;
    for (let i = 0; i < solveMoves.length; i++) {
        count = 0;
        if (duplicate != null) {
            if (solveMoves[i + 0] == duplicate) {
                count++;
                if (solveMoves[i + 1] == duplicate) {
                    count++;
                    if (solveMoves[i + 2] == duplicate) {
                        count++;
                        if (solveMoves[i + 3] == duplicate) {
                            count++;
                        }
                    }
                }
            }

            if (count > 1) {
                console.log(`${(count + 1)} same ${i - 1} - ${i + (count - 1)} ${solveMoves[i]}`)
            }
        }
        duplicate = solveMoves[i];
    }
}

let customcolor = 'white';
function setColor(x) {
    switch (x) {
        case 'W':
            customcolor = 'white';
            break;
        case 'G':
            customcolor = 'lime';
            break;
        case 'Y':
            customcolor = 'yellow';
            break;
        case 'O':
            customcolor = 'orange';
            break;
        case 'R':
            customcolor = 'red';
            break;
        case 'B':
            customcolor = 'rgb(0, 110, 255)';
            break;
    }
}

const customPieces = document.getElementsByClassName('c_piece');
[...customPieces].forEach(piece => {
    if (piece.className != 'c_piece mid') {
        piece.addEventListener('mousedown', function (e) {
            e.preventDefault();
            colorPieces(this, event.button, e);
        });
        piece.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
    }
});

function colorPieces(x, y, e) {
    e.preventDefault();
    y != 2 ? x.style.background = customcolor : x.style.background = 'transparent';
}



let customCube = [
    [//top
        [],
        [],
        []
    ],
    [//front
        [],
        [],
        []
    ],
    [//bottom
        [],
        [],
        []
    ],
    [//back
        [],
        [],
        []
    ],
    [//right
        [],
        [],
        []
    ],
    [//left
        [],
        [],
        []
    ]
];
function uploadCustomColors() {
    resetVariables();

    let _tops = [...document.getElementsByClassName('c_top')[0].children];
    let _fronts = [...document.getElementsByClassName('c_front')[0].children];
    let _bottoms = [...document.getElementsByClassName('c_bottom')[0].children];
    let _lefts = [...document.getElementsByClassName('c_left')[0].children];
    let _rights = [...document.getElementsByClassName('c_right')[0].children];
    let _backs = [...document.getElementsByClassName('c_back')[0].children];

    let tops = [];
    let fronts = [];
    let bottoms = [];
    let lefts = [];
    let rights = [];
    let backs = [];

    for (let i = 0; i < _tops.length; i++) {
        switch (_tops[i].style.background) {
            case 'white':
                tops[i] = 'w';
                break;
            case 'lime':
                tops[i] = 'g';
                break;
            case 'yellow':
                tops[i] = 'y';
                break;
            case 'orange':
                tops[i] = 'o';
                break;
            case 'red':
                tops[i] = 'r';
                break;
            case 'rgb(0, 110, 255)':
                tops[i] = 'b';
                break;
        }
    }
    for (let i = 0; i < _fronts.length; i++) {
        switch (_fronts[i].style.background) {
            case 'white':
                fronts[i] = 'w';
                break;
            case 'lime':
                fronts[i] = 'g';
                break;
            case 'yellow':
                fronts[i] = 'y';
                break;
            case 'orange':
                fronts[i] = 'o';
                break;
            case 'red':
                fronts[i] = 'r';
                break;
            case 'rgb(0, 110, 255)':
                fronts[i] = 'b';
                break;
        }
    }
    for (let i = 0; i < _bottoms.length; i++) {
        switch (_bottoms[i].style.background) {
            case 'white':
                bottoms[i] = 'w';
                break;
            case 'lime':
                bottoms[i] = 'g';
                break;
            case 'yellow':
                bottoms[i] = 'y';
                break;
            case 'orange':
                bottoms[i] = 'o';
                break;
            case 'red':
                bottoms[i] = 'r';
                break;
            case 'rgb(0, 110, 255)':
                bottoms[i] = 'b';
                break;
        }
    }
    for (let i = 0; i < _lefts.length; i++) {
        switch (_lefts[i].style.background) {
            case 'white':
                lefts[i] = 'w';
                break;
            case 'lime':
                lefts[i] = 'g';
                break;
            case 'yellow':
                lefts[i] = 'y';
                break;
            case 'orange':
                lefts[i] = 'o';
                break;
            case 'red':
                lefts[i] = 'r';
                break;
            case 'rgb(0, 110, 255)':
                lefts[i] = 'b';
                break;
        }
    }
    for (let i = 0; i < _rights.length; i++) {
        switch (_rights[i].style.background) {
            case 'white':
                rights[i] = 'w';
                break;
            case 'lime':
                rights[i] = 'g';
                break;
            case 'yellow':
                rights[i] = 'y';
                break;
            case 'orange':
                rights[i] = 'o';
                break;
            case 'red':
                rights[i] = 'r';
                break;
            case 'rgb(0, 110, 255)':
                rights[i] = 'b';
                break;
        }
    }
    for (let i = 0; i < _backs.length; i++) {
        switch (_backs[i].style.background) {
            case 'white':
                backs[i] = 'w';
                break;
            case 'lime':
                backs[i] = 'g';
                break;
            case 'yellow':
                backs[i] = 'y';
                break;
            case 'orange':
                backs[i] = 'o';
                break;
            case 'red':
                backs[i] = 'r';
                break;
            case 'rgb(0, 110, 255)':
                backs[i] = 'b';
                break;
        }
    }

    tops[4] = 'w';
    fronts[4] = 'g';
    bottoms[4] = 'y';
    lefts[4] = 'o';
    rights[4] = 'r';
    backs[4] = 'b';

    // console.log(tops);
    // console.log(fronts);
    // console.log(bottoms);
    // console.log(lefts);
    // console.log(rights);
    // console.log(backs);

    // EDGES
    // top edges
    let edgeW1 = tops[1] + backs[1];
    let edgeW2 = tops[3] + lefts[1];
    let edgeW3 = tops[5] + rights[1];
    let edgeW4 = tops[7] + fronts[1];
    // front edges
    let edgeG1 = fronts[1] + tops[7];
    let edgeG2 = fronts[3] + lefts[5];
    let edgeG3 = fronts[5] + rights[3];
    let edgeG4 = fronts[7] + bottoms[1];
    // bottom edges
    let edgeY1 = bottoms[1] + fronts[7];
    let edgeY2 = bottoms[3] + lefts[7];
    let edgeY3 = bottoms[5] + rights[7];
    let edgeY4 = bottoms[7] + backs[7];
    // left edges
    let edgeO1 = lefts[1] + tops[3];
    let edgeO2 = lefts[3] + backs[5];
    let edgeO3 = lefts[5] + fronts[3];
    let edgeO4 = lefts[7] + bottoms[3];
    // right edges
    let edgeR1 = rights[1] + tops[5];
    let edgeR2 = rights[3] + fronts[5];
    let edgeR3 = rights[5] + backs[3];
    let edgeR4 = rights[7] + bottoms[5];
    // back edges
    let edgeB1 = backs[1] + tops[1];
    let edgeB2 = backs[3] + rights[5];
    let edgeB3 = backs[5] + lefts[3];
    let edgeB4 = backs[7] + bottoms[7];

    //tops
    console.log('tops');
    customCube[0][0][1] = getColorCode(edgeW1, 'edge');
    customCube[0][1][0] = getColorCode(edgeW2, 'edge');
    customCube[0][1][2] = getColorCode(edgeW3, 'edge');
    customCube[0][2][1] = getColorCode(edgeW4, 'edge');
    //fronts
    console.log('fronts');
    customCube[1][0][1] = getColorCode(edgeG1, 'edge');
    customCube[1][1][0] = getColorCode(edgeG2, 'edge');
    customCube[1][1][2] = getColorCode(edgeG3, 'edge');
    customCube[1][2][1] = getColorCode(edgeG4, 'edge');
    //bottoms
    console.log('bottoms');
    customCube[2][0][1] = getColorCode(edgeY1, 'edge');
    customCube[2][1][0] = getColorCode(edgeY2, 'edge');
    customCube[2][1][2] = getColorCode(edgeY3, 'edge');
    customCube[2][2][1] = getColorCode(edgeY4, 'edge');
    //backs
    console.log('backs');
    customCube[3][0][1] = getColorCode(edgeB1, 'edge');
    customCube[3][1][0] = getColorCode(edgeB2, 'edge');
    customCube[3][1][2] = getColorCode(edgeB3, 'edge');
    customCube[3][2][1] = getColorCode(edgeB4, 'edge');
    //right
    console.log('right');
    customCube[4][0][1] = getColorCode(edgeR1, 'edge');
    customCube[4][1][0] = getColorCode(edgeR2, 'edge');
    customCube[4][1][2] = getColorCode(edgeR3, 'edge');
    customCube[4][2][1] = getColorCode(edgeR4, 'edge');
    //left
    console.log('left');
    customCube[5][0][1] = getColorCode(edgeO1, 'edge');
    customCube[5][1][0] = getColorCode(edgeO2, 'edge');
    customCube[5][1][2] = getColorCode(edgeO3, 'edge');
    customCube[5][2][1] = getColorCode(edgeO4, 'edge');


    // CORNERS
    //tops
    let cornerW1 = tops[0] + lefts[0] + backs[2];
    let cornerW2 = tops[2] + rights[2] + backs[0];
    let cornerW3 = tops[6] + fronts[0] + lefts[2];
    let cornerW4 = tops[8] + fronts[2] + rights[0];
    //fronts
    let cornerG1 = fronts[0] + tops[6] + lefts[2];
    let cornerG2 = fronts[2] + tops[8] + rights[0];
    let cornerG3 = fronts[6] + bottoms[0] + lefts[8];
    let cornerG4 = fronts[8] + bottoms[2] + rights[6];
    //bottoms
    let cornerY1 = bottoms[0] + fronts[6] + lefts[8];
    let cornerY2 = bottoms[2] + fronts[8] + rights[6];
    let cornerY3 = bottoms[6] + lefts[6] + backs[8];
    let cornerY4 = bottoms[8] + rights[8] + backs[6];
    //backs
    let cornerB1 = backs[0] + tops[2] + rights[2];
    let cornerB2 = backs[2] + tops[0] + lefts[0];
    let cornerB3 = backs[6] + bottoms[8] + rights[8];
    let cornerB4 = backs[8] + bottoms[6] + lefts[6];
    //lefts
    let cornerO1 = lefts[0] + tops[0] + backs[2];
    let cornerO2 = lefts[2] + tops[6] + fronts[0];
    let cornerO3 = lefts[6] + bottoms[6] + backs[8];
    let cornerO4 = lefts[8] + fronts[6] + bottoms[0];
    //rights
    let cornerR1 = rights[0] + tops[8] + fronts[2];
    let cornerR2 = rights[2] + tops[2] + backs[0];
    let cornerR3 = rights[6] + fronts[8] + bottoms[2];
    let cornerR4 = rights[8] + bottoms[8] + backs[6];

    //tops
    customCube[0][0][0] = getColorCode(cornerW1, 'corner');
    customCube[0][0][2] = getColorCode(cornerW2, 'corner');
    customCube[0][2][0] = getColorCode(cornerW3, 'corner');
    customCube[0][2][2] = getColorCode(cornerW4, 'corner');
    //fronts
    customCube[1][0][0] = getColorCode(cornerG1, 'corner');
    customCube[1][0][2] = getColorCode(cornerG2, 'corner');
    customCube[1][2][0] = getColorCode(cornerG3, 'corner');
    customCube[1][2][2] = getColorCode(cornerG4, 'corner');
    //bottoms
    customCube[2][0][0] = getColorCode(cornerY1, 'corner');
    customCube[2][0][2] = getColorCode(cornerY2, 'corner');
    customCube[2][2][0] = getColorCode(cornerY3, 'corner');
    customCube[2][2][2] = getColorCode(cornerY4, 'corner');
    //backs
    customCube[3][0][0] = getColorCode(cornerB1, 'corner');
    customCube[3][0][2] = getColorCode(cornerB2, 'corner');
    customCube[3][2][0] = getColorCode(cornerB3, 'corner');
    customCube[3][2][2] = getColorCode(cornerB4, 'corner');
    //rights
    customCube[4][0][0] = getColorCode(cornerR1, 'corner');
    customCube[4][0][2] = getColorCode(cornerR2, 'corner');
    customCube[4][2][0] = getColorCode(cornerR3, 'corner');
    customCube[4][2][2] = getColorCode(cornerR4, 'corner');
    //lefs
    customCube[5][0][0] = getColorCode(cornerO1, 'corner');
    customCube[5][0][2] = getColorCode(cornerO2, 'corner');
    customCube[5][2][0] = getColorCode(cornerO3, 'corner');
    customCube[5][2][2] = getColorCode(cornerO4, 'corner');

    // MIDS
    customCube[0][1][1] = 'w-5';
    customCube[1][1][1] = 'g-5';
    customCube[2][1][1] = 'y-5';
    customCube[3][1][1] = 'b-5';
    customCube[4][1][1] = 'r-5';
    customCube[5][1][1] = 'o-5';

    cube = customCube;
    _onload();
}

//#region SET COLOR ARRAY TO CUBE ARRAY
function getColorCode(x, y) {
    if (y == 'edge') {
        switch (x) {
            case 'wb':
                return 'w-2'
            case 'wo':
                return 'w-4'
            case 'wr':
                return 'w-6'
            case 'wg':
                return 'w-8'

            case 'gw':
                return 'g-2'
            case 'go':
                return 'g-4'
            case 'gr':
                return 'g-6'
            case 'gy':
                return 'g-8'

            case 'yg':
                return 'y-2'
            case 'yo':
                return 'y-4'
            case 'yr':
                return 'y-6'
            case 'yb':
                return 'y-8'

            case 'ow':
                return 'o-2'
            case 'ob':
                return 'o-4'
            case 'og':
                return 'o-6'
            case 'oy':
                return 'o-8'

            case 'rw':
                return 'r-2'
            case 'rg':
                return 'r-4'
            case 'rb':
                return 'r-6'
            case 'ry':
                return 'r-8'

            case 'bw':
                return 'b-2'
            case 'br':
                return 'b-4'
            case 'bo':
                return 'b-6'
            case 'by':
                return 'b-8'

            default:
                console.log('vermiste kleurcode')
                break;
        }
    }
    else if (y == 'corner') {
        switch (x) {
            //tops
            case 'wob':
            case 'wbo':
                return 'w-1'
            case 'wrb':
            case 'wbr':
                return 'w-3'
            case 'wgo':
            case 'wog':
                return 'w-7'
            case 'wgr':
            case 'wrg':
                return 'w-9'
            //fronts
            case 'gwo':
            case 'gow':
                return 'g-1'
            case 'gwr':
            case 'grw':
                return 'g-3'
            case 'gyo':
            case 'goy':
                return 'g-7'
            case 'gyr':
            case 'gry':
                return 'g-9'
            //bottoms
            case 'ygo':
            case 'yog':
                return 'y-1'
            case 'ygr':
            case 'yrg':
                return 'y-3'
            case 'yob':
            case 'ybo':
                return 'y-7'
            case 'yrb':
            case 'ybr':
                return 'y-9'
            //backs
            case 'bwr':
            case 'brw':
                return 'b-1'
            case 'bwo':
            case 'bow':
                return 'b-3'
            case 'byr':
            case 'bry':
                return 'b-7'
            case 'byo':
            case 'boy':
                return 'b-9'
            //rights
            case 'rwg':
            case 'rgw':
                return 'r-1'
            case 'rwb':
            case 'rbw':
                return 'r-3'
            case 'rgy':
            case 'ryg':
                return 'r-7'
            case 'ryb':
            case 'rby':
                return 'r-9'
            //lefts
            case 'owb':
            case 'obw':
                return 'o-1'
            case 'owg':
            case 'ogw':
                return 'o-3'
            case 'oyb':
            case 'oby':
                return 'o-7'
            case 'ogy':
            case 'oyg':
                return 'o-9'
            default:
                console.log('verkeerde corner kleurupload')
                break;
        }
    }
}
//#endregion

//#region SCANNED RESULTS
function checkScannedResults() {
    let toppy = document.getElementsByClassName('toppy')[0].innerHTML.replaceAll("'", '').replaceAll(',', '').replace('[', '').replace(']', '').replaceAll(" ", '');
    let frontpy = document.getElementsByClassName('frontpy')[0].innerHTML.replaceAll("'", '').replaceAll(',', '').replace('[', '').replace(']', '').replaceAll(" ", '');
    let bottompy = document.getElementsByClassName('bottompy')[0].innerHTML.replaceAll("'", '').replaceAll(',', '').replace('[', '').replace(']', '').replaceAll(" ", '');
    let backpy = document.getElementsByClassName('backpy')[0].innerHTML.replaceAll("'", '').replaceAll(',', '').replace('[', '').replace(']', '').replaceAll(" ", '');
    let rightpy = document.getElementsByClassName('rightpy')[0].innerHTML.replaceAll("'", '').replaceAll(',', '').replace('[', '').replace(']', '').replaceAll(" ", '');
    let leftpy = document.getElementsByClassName('leftpy')[0].innerHTML.replaceAll("'", '').replaceAll(',', '').replace('[', '').replace(']', '').replaceAll(" ", '');

    if (toppy == '0') {
        console.log(toppy + "string")
    }
    else {
        let _tops = [...document.getElementsByClassName('c_top')[0].children];
        let _fronts = [...document.getElementsByClassName('c_front')[0].children];
        let _bottoms = [...document.getElementsByClassName('c_bottom')[0].children];
        let _lefts = [...document.getElementsByClassName('c_left')[0].children];
        let _rights = [...document.getElementsByClassName('c_right')[0].children];
        let _backs = [...document.getElementsByClassName('c_back')[0].children];

        _tops[0].style.backgroundColor = 'white';
        for (let i = 0; i < toppy.length; i++) {
            _tops[i].style.background = getColor(toppy[i]);
            _fronts[i].style.background = getColor(frontpy[i]);
            _bottoms[i].style.background = getColor(bottompy[i]);
            _lefts[i].style.background = getColor(leftpy[i]);
            _rights[i].style.background = getColor(rightpy[i]);
            _backs[i].style.background = getColor(backpy[i]);
        }
    }
}

//#endregion

function getColor(x) {
    switch (x.toUpperCase()) {
        case 'W':
            return 'white';
        case 'G':
            return 'lime';
        case 'Y':
            return 'yellow';
        case 'O':
            return 'orange';
        case 'R':
            return 'red';
        case 'B':
            return 'rgb(0, 110, 255)';
    }
}
function getFace(x) {
    switch (x.toUpperCase()) {
        case 'W':
            return 'U';
        case 'G':
            return 'F';
        case 'Y':
            return 'D';
        case 'O':
            return 'L';
        case 'R':
            return 'R';
        case 'B':
            return 'B';
    }
}

//#region STATE TO abc

//maakt van: ['aaa', 'a', 'q', 'rd', 'rd', 'b', 'b', 'b', 'b', 'x', 'x', 'x', 'e', 'c', 'c', 'z', 'z', 'z', 'z']
//'a2', 'q1', 'r1', 'b2', 'x3', 'e1', 'c2', 'z4'
let ioa = 0;
let iPrev = 0;
let result = [];
function optimizeArr(x) {
    let prev = x[ioa];
    while (x[ioa] == prev) { ioa++; }
    result.push(prev + (ioa - iPrev));
    iPrev = ioa;
    if (x.length > ioa) { optimizeArr(x); }
}

//maakt van DD, D2 & DDD, D' & DDDD, empty
let result2 = [];
function toCubeMoves(x) {
    for (let i = 0; i < x.length; i++) {
        let dir = x[i].slice(0, (x[i].length - 1));

        if (x[i][x[i].length - 1] == 1) {
            result2.push(dir);
        }
        else if (x[i][x[i].length - 1] == 2) {
            result2.push(dir[0] + 2);
        }
        else if (x[i][x[i].length - 1] == 3) {
            if (x[i][1] == "'") {
                result2.push(x[i][0])
            }
            else {
                result2.push(dir + "'")
            }
        }
        else if (x[i][x[i].length - 1] == 4) {
            //dont push (4 moves == nothing)
        }
        else {
            //push the amount of times thats required
            let z = x[i][x[i].length - 1] % 4;

            if (z == 1) {
                result2.push(dir);
            }
            else if (z == 2) {
                result2.push(dir[0] + 2);
            }
            else if (z == 3) {
                if (x[i][1] == "'") {
                    result2.push(x[i][0])
                }
                else {
                    result2.push(dir + "'")
                }
            }
            else if (z == 0) {
                //dont push (4 moves == nothing)
            }
        }
    }
}

//maakt bv. van //D' D2, D
let result3 = [];
function removeOpposites(x) {
    let i;
    for (i = 0; i < x.length; i++) {
        try {
            if (x[i][0] == x[i + 1][0]) {
                //D D', D' D
                if ((x[i][1] == null && x[i + 1][1] == "'") || (x[i][1] == "'" && x[i + 1][1] == null)) {
                    //dont push
                    i++;
                }
                //D2 D'
                else if (x[i][1] == '2' && x[i + 1][1] == "'") {
                    result3.push(x[i][0]);
                    i++;
                }
                //D2 D
                else if (x[i][1] == '2' && x[i + 1][1] == null) {
                    result3.push(x[i][0] + "'");
                    i++;
                }
                //D' D2
                else if (x[i][1] == "'" && x[i + 1][1] == '2') {
                    result3.push(x[i][0]);
                    i++;
                }
                //D D2
                else if (x[i][1] == null && x[i + 1][1] == '2') {
                    result3.push(x[i][0] + "'");
                    i++;
                }
                else {
                    result3.push(x[i]);
                    // console.log(i);
                }
            }
            else {
                result3.push(x[i]);
            }
        } catch (error) {
            result3.push(x[i]);
        }
    }
}
//#endregion

//#region TO BYTE ARRAY
// TO BYTE ARRAY
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
//#endregion 

function solveArduino() {
    optimizeArr(arrHistorySequence);
    toCubeMoves(result);
    removeOpposites(result2);
    let state = toByteArr(result3).join('');

    // //
    console.log(state);
    window.open(`http://localhost:8080/solve?combo=${state}`);
}

function solveKociemba() {
    let kociembaState = [];

    let kociembaTemp = cube.flat(2);
    let kociembaTemp2 = [];

    //prepare array
    for (let i = 0; i < 9; i++) { //U
        kociembaTemp2.push(kociembaTemp[i])
    }
    for (let i = 36; i < 45; i++) { //R
        kociembaTemp2.push(kociembaTemp[i])
    }
    for (let i = 9; i < 18; i++) { //F
        kociembaTemp2.push(kociembaTemp[i])
    }
    for (let i = 18; i < 27; i++) { //D
        kociembaTemp2.push(kociembaTemp[i])
    }
    for (let i = 45; i < 54; i++) { //L
        kociembaTemp2.push(kociembaTemp[i])
    }
    for (let i = 27; i < 36; i++) { //B
        kociembaTemp2.push(kociembaTemp[i])
    }

    //translate colors to faces
    for (let i = 0; i < kociembaTemp2.length; i++) {
        kociembaState.push(getFace(kociembaTemp2[i][0]))        
    }

    kociembaState = kociembaState.join().replaceAll(',','')
    console.log(kociembaState)
    window.open(`http://localhost:5000/state/${kociembaState}`);
}

// UFDBRL --bad
// URFDLB --good

// DRLUUBFBRBLURRLRUBLRDDFDLFUFUFFDBRDUBRUFLLFDDBFLUBLRBD