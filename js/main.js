'use strict'
const MINE = '💥'
const EMPTY = ''
var gBoard
var gLevel = {
    SIZE: 4,
    MINES: 2
};

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function buildBoard() {
    var size = gLevel.SIZE
    const board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = createCell()
        }
        // console.table(board)
    }
    return board
}

function createCell() {
    const cell = {
        minesAroundCount: 0,
        isShown: true,
        isMine: false,
        isMarked: true
    }
    return cell
}

function renderBoard(board){
    var size = gLevel.SIZE
    var strHTML = '<table><tbody>'
    for (var i = 0; i < size; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < size; j++) {
            const cell = board[i][j]
            var str
            var className
            if (cell.isShown === true) {
                className = 'show-cell'
                str = cell.isMine ? MOKESH : cell.minesAroundCount
                if (!cell.minesAroundCount) str = EMPTY

            } else {
                className = 'hide-cell'
                str = EMPTY
            }

            strHTML += `<td class"${className}" onclick="onCellClicked(this, ${i},${j})" >${str}</td>`

        }
        strHTML += '</tr>'
    }
    strHTML += '</table></tbody>'
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function countMines(board, pos) {
    var count = 0
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (i === pos.i && j === pos.j) continue
            if (j < 0 || j >= board[0].length) continue
            if (board[i][j].isMine) count++
        }
    }
    return count
}



