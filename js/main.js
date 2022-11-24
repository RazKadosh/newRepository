'use strict'
const MINE = '💥'
const EMPTY = ''
const LIFE = '❤️'
const FLAG = '🚩'
const NORMAL = '😎'
const LOSE = '😭'
const WIN = '🏆'



var gInterval
var gStartTime
var gBoard

var gLevel = {
    SIZE: 4,
    MINES: 2,
    LIFE: 1
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit() {
    if (gInterval) clearInterval(gInterval)
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function setMinesNegsCount(board) {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            const cell = board[i][j]
            cell.minesAroundCount = countMines(board, i, j)
        }
    }
}

function countMines(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            if (board[i][j].isMine) count++
        }
    }
    return count
}

function onCellClicked(elCell) {

    if (!gGame.isOn) return
    var location = {
        i: elCell.dataset.i,
        j: elCell.dataset.j
    }
    const cell = gBoard[location.i][location.j]
    const cellI = +location.i
    const cellJ = +location.j

    if (cell.countMokeshAround === 0 && !cell.isMine) {
        expandShown(gBoard, cellI, cellJ)
    }
    if (gGame.shownCount === 0) {
        startTimer()
    }
    if (cell.isMarked) return
    if (cell.isShown) return
    cell.isShown = true
    gGame.shownCount++
    console.log('gGame.shownCount:', gGame.shownCount)
    renderCell(location)

    if (cell.isMine) {
        if (gLevel.LIFE > 0)
            gLevel.LIFE--
        createLife()
        if (gLevel.LIFE === 0) {
            if (gInterval) clearInterval(gInterval)
            gameOver()
        }
    }
    checkGameOver()
}

function cellMarked(elFlag, location) {
    if (!gGame.isOn) return
    var location = {
        i: elFlag.dataset.i,
        j: elFlag.dataset.j
    }
    const cell = gBoard[location.i][location.j]
    if (cell.isShown) {
        return
    }
    if (cell.isMarked === false) {
        elFlag.innerText = FLAG
        gGame.markedCount++
    }
    if (cell.isMarked) {
        elFlag.innerText = ''
        gGame.markedCount--
    }
    console.log(' gGame.markedCount:', gGame.markedCount)

    cell.isMarked = !cell.isMarked
}
function changeLevel(level) {
    if (level === 'easy') {
        gLevel.SIZE = 4
        gLevel.MINES = 2
        gGame.LIFE = 2
    } 
    if (level === 'hard') {
        gLevel.SIZE = 8
        gLevel.MINES = 14
        gGame.LIFE = 3
    }
    if (level === 'extreme') {
        gLevel.SIZE = 12
        gLevel.MINES = 32
        gGame.LIFE = 3
    }
    createLife()
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function buildBoard() {
    var size = gLevel.SIZE
    const board = []
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = createCell()
        }
    }
    for (var i = 0; i < gLevel.MINES; i++) {
        const idxI = getRandomInt(0, gLevel.SIZE)
        const idxJ = getRandomInt(0, gLevel.SIZE)
        board[idxI][idxJ].isMine = true
    }
    setMinesNegsCount(board)
    return board
}

function createCell() {
    const cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
    return cell
}



function restart() {
    gGame.isOn = true
    var elemoji = document.querySelector('.emoji')
    elemoji.innerText = '😎'
    resetTime()
    onInit()
}

function startTimer() {
    gStartTime = Date.now()
    gInterval = setInterval(() => {
        const seconds = (Date.now() - gStartTime) / 1000
        var elh3 = document.querySelector('.timer')
        elh3.innerText = seconds.toFixed(3)
    }, 1);
}

function resetTime() {
    var elh3 = document.querySelector('.timer')
    elh3.innerText = '0.000'
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            var str
            var className = `cell cell-${i}-${j}`
            
            if (cell.isShown) {
                str = (cell.isMine) ? MINE : cell.minesAroundCount
                if (!cell.minesAroundCount) str = EMPTY
                
            } else {
                str = EMPTY
            }
            strHTML += `<td class="${className}" onclick="onCellClicked(this)"oncontextmenu=" cellMarked(this)" data-i="${i}" data-j="${j}">${str}</td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

function renderCell(location) {
    var str
    const cell = gBoard[location.i][location.j]
    if (cell.isShown) {
        str = (cell.isMine) ? MINE : cell.minesAroundCount
    }
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerText = str
}

function checkGameOver() {
    if (gGame.shownCount === (gLevel.SIZE ** 2) - gLevel.MINES && gGame.markedCount === gLevel.MINES) victory()
}

function createLife() {
    const elLife = document.querySelector('.try span')
    elLife.innerText = LIFE.repeat(gLevel.LIFE)
}

function victory() {
    gGame.isOn = false
    var elSmile = document.querySelector('.emoji')
    elSmile.innerText = '🏆'
    if (gInterval) clearInterval(gInterval)
}

function gameOver() {
    gGame.isOn = false
    var elSmile = document.querySelector('.emoji')
    elSmile.innerText = '😭'

}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}