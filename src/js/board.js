var chess = chess || {};

/**
 * @param {HTMLTableElement} table
 */
chess.Board = function(table) {
    this.table_ = table;
    this.setToStartingPosition();
}

/**
 * Resets the board.
 */
chess.Board.prototype.setToStartingPosition = function() {
    chess.log("Set to starting position");

    // Squares a1-h2 and a7-h8.
    for (var square in this.startingPosition_) {
        var piece = this.startingPosition_[square];
        this.setPieceOnSquare(piece, square);
    }

    // Squares a3-h6 need to be emptied.
    for (var row = 'a'.charCodeAt(0); row <= 'h'.charCodeAt(0); row++) {
        for (var rank = 3; rank <= 6; rank++) {
            this.setPieceOnSquare(null, String.fromCharCode(row) + rank);
        }
    }
}

/**
 * @param {string} piece One of PBNRQK for white, pbnrqk for black. Null if the square is to be empty.
 * @param {string} square Like "a4".
 */
chess.Board.prototype.setPieceOnSquare = function(piece, square) {
    var bgPosition;
    if (piece === null || piece === '') {
        bgPosition = chess.Board.EMPTY_SQUARE_BG;
    } else {
        if (typeof this.pieceBgPositions_[piece] === 'undefined') {
            throw 'Unknown piece: ' + piece;
        }
        bgPosition = this.pieceBgPositions_[piece];
    }

    var squareEl = this.getSquare_(square);
    squareEl.style.backgroundPosition = bgPosition[0] + 'px ' + bgPosition[1] + 'px';
    squareEl.setAttribute('data-piece', piece ? piece : ''); // be careful not to set as string "null".
}

/**
 * @return {boolean} Whether the square is occupied by any piece.
 */
chess.Board.prototype.isSquareOccupied = function(square) {
    var piece = this.getSquare_(square).getAttribute('data-piece');
    return (piece != null && piece.length > 0);
}

/**
 * @return {string} 'p', 'B', null, etc. Never an empty string.
 */
chess.Board.prototype.getPieceOnSquare = function(square) {
    var piece = this.getSquare_(square).getAttribute('data-piece');
    return (piece == '' ? null : piece);
}

/**
 * @return {array} The square names that "color"s "piece"s are on.
 */
chess.Board.prototype.filterAllSquaresByPieceAndColor = function(piece, color) {
    var squares = this.filterAllSquaresByPredicate_(function(square, squarePiece) {
        return squarePiece === (color === 'w' ? piece.toUpperCase() : piece.toLowerCase());
    });
    return squares;
}

/**
 * Find squares that "predicate" returns true for.
 * @param {function} predicate Passed two arguments, the square name ("c4") and occupying piece ("K").
 * @return {array} ["c7", "g7"]
 * @private
 */
chess.Board.prototype.filterAllSquaresByPredicate_ = function(predicate) {
    var results = [];
    var squares = this.table_.getElementsByTagName('td');
    for (var i = 0; i < squares.length; i++) {
        var squareEl = squares[i];
        var squareName = squareEl.id.substr(19);
        var piece = squareEl.getAttribute('data-piece');

        if (predicate(squareName, piece)) {
            results.push(squareName);
        }
    }
    return results;
}

/** @private */
chess.Board.prototype.getSquare_ = function(square) {
    var sq = document.getElementById('game-viewer-square-' + square);
    if (sq == null) {
        throw ("Square does not exist: " + square);
    }
    return sq;
}

/** @private @type {HTMLTableElement} */
chess.Board.prototype.table_ = null;

/** @private */
chess.Board.EMPTY_SQUARE_BG = [50, 50];

/** @private */
chess.Board.prototype.pieceBgPositions_ = {
    '': chess.Board.EMPTY_SQUARE_BG,
    'P': [0, 0],
    'B': [-48, 0],
    'N': [-96, 0],
    'R': [-144, 0],
    'Q': [-192, 0],
    'K': [-240, 0],
    'p': [0, -48],
    'b': [-48, -48],
    'n': [-96, -48],
    'r': [-144, -48],
    'q': [-192, -48],
    'k': [-240, -48]
};

/** @private */
chess.Board.prototype.startingPosition_ = {
    'a1': 'R',
    'b1': 'N',
    'c1': 'B',
    'd1': 'Q',
    'e1': 'K',
    'f1': 'B',
    'g1': 'N',
    'h1': 'R',
    'a2': 'P',
    'b2': 'P',
    'c2': 'P',
    'd2': 'P',
    'e2': 'P',
    'f2': 'P',
    'g2': 'P',
    'h2': 'P',
    'a7': 'p',
    'b7': 'p',
    'c7': 'p',
    'd7': 'p',
    'e7': 'p',
    'f7': 'p',
    'g7': 'p',
    'h7': 'p',
    'a8': 'r',
    'b8': 'n',
    'c8': 'b',
    'd8': 'q',
    'e8': 'k',
    'f8': 'b',
    'g8': 'n',
    'h8': 'r'
};
