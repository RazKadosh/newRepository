'use strict'
const MINE = '💥'
const EMPTY = ''
const LIFE = '❤️'
const FLAG = '🚩'
const NORMAL = '😎'
const LOSE = '😭'
const WIN = '🏆'


var gLevel
var gInterval
var gStartTime
var gBoard

gLevel = {
    SIZE: 4,
    MINES: 2,
    LIFE: 3
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit() {
    if (gInterval) clearInterval(gInterval)
    createLife(gLevel.LIFE)
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

    if (!gGame.isOn) {
        placeMine()
        startTimer()
        gGame.isOn = true
    }
    var location = {
        i: elCell.dataset.i,
        j: elCell.dataset.j
    }
    const cell = gBoard[location.i][location.j]
    if (gGame.shownCount === 0) {

    }
    if (cell.minesAroundCount === 0 && !cell.isMine)
        if (cell.isMarked) return
    if (cell.isShown) return
    cell.isShown = true
    gGame.shownCount++
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
    gBoard = buildBoard()
    renderBoard(gBoard)
    createLife()
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

    return board
}

function placeMine() {
    for (var i = 0; i < gLevel.MINES; i++) {
        const idxI = getRandomInt(0, gLevel.SIZE)
        const idxJ = getRandomInt(0, gLevel.SIZE)
        gBoard[idxI][idxJ].isMine = true
    }
    setMinesNegsCount(gBoard)
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
    var elemoji = document.querySelector('.emoji')
    elemoji.innerText = '😎'
    resetTime()
    onInit()
    createLife(gLevel.LIFE)
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
    elSmile.innerText = WIN
    if (gInterval) clearInterval(gInterval)
}

function gameOver() {
    gGame.isOn = false
    var elSmile = document.querySelector('.emoji')
    elSmile.innerText = LOSE

}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}