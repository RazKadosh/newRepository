'use strict'


const MOKESH = '💣'
const FLOOR = ''
const FLAG = '🚩'
const LIFE = '❤️'

var gTime
var gStartTime
var gInterval
var gBoard
var gLevel
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

 gLevel = {
    SIZE: 4,
    MINES: 2,
    LIFE:1
}


function onInit() {
    if (gInterval) clearInterval(gInterval)
    gGame.markedCount = 0
    gGame.shownCount = 0
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)
    resetTime()

}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            if (!cell.isMine) {
                cell.minesAroundCount = countMokeshAround(board, i, j)
            }
        }
    }
}

function countMokeshAround(board, cellI, cellJ) {
    var neighborsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            if (board[i][j].isMine) neighborsCount++
        }
    }
    console.log('count:', neighborsCount)
    return neighborsCount
}



function onCellClicked(elCell) {
    // if (cell.isMarked) return
    if (!gGame.isOn) return
    var location = {
        i: elCell.dataset.i,
        j: elCell.dataset.j
    }
    if (gGame.shownCount === 0) {
        startTimer()

    }
    const cell = gBoard[location.i][location.j]
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

            if (gInterval) clearInterval(gInterval)
            gameOver()
    }

    if (gGame.isShown === (gLevel.SIZE ** 2 - gGame.markedCount)) {
        victory()
    }


}


function restart() {
    gGame.isOn = true
    createLife(gLevel.LIFE)
    var elSmile = document.querySelector('.smile')
    elSmile.innerText = '😊'
    resetTime()
    onInit()
}

function startTimer() {
    gStartTime = Date.now()
    gInterval = setInterval(() => {
        const seconds = (Date.now() - gStartTime) / 1000
        var elH2 = document.querySelector('.time')
        elH2.innerText = seconds.toFixed(3)

    }, 1);
}

function resetTime() {
    var elH2 = document.querySelector('.time')
    elH2.innerText = '0.000'
}

function changeLevel(level) {

    if (level === 'easy') {
        gLevel.SIZE = 6
        gLevel.MINES = 5
        gLevel.LIFE=1
    }

    if (level === 'medium') {
        gLevel.SIZE = 8
        gLevel.MINES = 9
        gLevel.LIFE= 3
       
    }
    if (level === 'hard') {
        gLevel.SIZE = 10
        gLevel.MINES = 20
        gLevel.LIFE = 5
    }
    gBoard = buildBoard()
    renderBoard(gBoard)
    createLife()
  

}

function createLife(){
    const elLife=document.querySelector('.life span')
    elLife.innerText=LIFE.repeat (gLevel.LIFE)
}

function victory() {
    gGame.isOn = false
    var elSmile = document.querySelector('.smile')
    elSmile.innerText = '🤩'
}

function gameOver() {
    gGame.isOn = false
    var elSmile = document.querySelector('.smile')
    elSmile.innerText = '😵'

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