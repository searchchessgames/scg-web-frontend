var chess = chess || {};

/**
 * @param {string} move
 * @param {string} color 'w' or 'b'
 * @param {chess.Board} board
 */
chess.Move = function(move, color, board) {
    if (color != 'w' && color != 'b') {
        throw "Color must be 'w' or 'b'";
    } else if (!move) {
        throw 'Move required';
    } else if (!board) {
        throw 'Board required';
    }

    this.move_ = move;
    this.square_ = (/[a-z][1-8]/.test(move) ? /[a-z][1-8]/.exec(move)[0] : null);
    this.color_ = color;
    this.white_ = color === 'w';
    this.board_ = board;
}

chess.Move.prototype.go = function() {
    var isCastle = (this.move_.indexOf('O-O') === 0 || this.move_.indexOf('0-0') === 0); // accepts letter O and number 0
    var isPawnPromotion = /\=[QRNB]/.test(this.move_);
    var isBishopMove = (this.move_.indexOf('B') === 0);
    var isKnightMove = (this.move_.indexOf('N') === 0);
    var isRookMove = (this.move_.indexOf('R') === 0);
    var isQueenMove = (this.move_.indexOf('Q') === 0);
    var isKingMove = (this.move_.indexOf('K') === 0);
    var isCapture = (this.move_.indexOf('x') === 1 || this.move_.indexOf('x') === 2);
    var isPawnMove = /^[a-z]/.test(this.move_[0]);

    if (isCastle) {
        this.castle_();
    } else if (isPawnPromotion && isCapture) {
        this.captureWithPawnAndPromote_();
    } else if (isPawnPromotion) {
        this.movePawnAndPromote_();
    } else if (isBishopMove) {
        this.moveOrCaptureWithBishop_();
    } else if (isKnightMove) {
        this.moveOrCaptureWithKnight_();
    } else if (isRookMove) {
        this.moveOrCaptureWithRook_();
    } else if (isQueenMove) {
        this.moveOrCaptureWithQueen_();
    } else if (isKingMove) {
        this.moveOrCaptureWithKing_();
    } else if (isPawnMove && isCapture) {
        this.captureWithPawn_();
    } else if (isPawnMove) {
        this.movePawn_();
    } else {
        chess.log("Unexpected move: " + this.move_);
    }
}

/** @private */
chess.Move.prototype.castle_ = function() {
    chess.log("Castle: " + this.move_);

    var isQueenSide = this.move_.length >= 5;

    if (isQueenSide && this.white_) {
        this.board_.setPieceOnSquare('R', 'd1');
        this.board_.setPieceOnSquare('K', 'c1');
        this.board_.setPieceOnSquare(null, 'a1');
        this.board_.setPieceOnSquare(null, 'e1');
    } else if (isQueenSide) {
        this.board_.setPieceOnSquare('r', 'd8');
        this.board_.setPieceOnSquare('k', 'c8');
        this.board_.setPieceOnSquare(null, 'a8');
        this.board_.setPieceOnSquare(null, 'e8');
    } else if (this.white_) {
        this.board_.setPieceOnSquare('R', 'f1');
        this.board_.setPieceOnSquare('K', 'g1');
        this.board_.setPieceOnSquare(null, 'h1');
        this.board_.setPieceOnSquare(null, 'e1');
    } else {
        this.board_.setPieceOnSquare('r', 'f8');
        this.board_.setPieceOnSquare('k', 'g8');
        this.board_.setPieceOnSquare(null, 'h8');
        this.board_.setPieceOnSquare(null, 'e8');
    }
}

/** @private */
chess.Move.prototype.captureWithPawnAndPromote_ = function() {
    chess.log("Capture with pawn and promote: " + this.move_);

    var fromRow = this.move_[0];
    var fromRank = parseInt(this.move_[3], 10) + (this.white_ ? -1 : 1);
    var fromSquare = fromRow + fromRank;
    this.board_.setPieceOnSquare(null, fromSquare);

    var promoteTo = this.move_[this.move_.indexOf('=') + 1];
    promoteTo = this.white_ ? promoteTo.toUpperCase() : promoteTo.toLowerCase();
    this.board_.setPieceOnSquare(promoteTo, this.square_);
}

/** @private */
chess.Move.prototype.movePawnAndPromote_ = function() {
    chess.log("Move pawn and promote: " + this.move_);

    var fromRow = this.move_[0];
    var fromRank = parseInt(this.move_[1], 10) + (this.white_ ? -1 : 1);
    var fromSquare = fromRow + fromRank;
    this.board_.setPieceOnSquare(null, fromSquare);

    var promoteTo = this.move_[3];
    promoteTo = this.white_ ? promoteTo.toUpperCase() : promoteTo.toLowerCase();
    this.board_.setPieceOnSquare(promoteTo, this.square_);
}

/** @private */
chess.Move.prototype.moveOrCaptureWithKnight_ = function() {
    var candidates = [];
    var alternations = [[1, -2], [1, 2], [2, -1], [2, 1], [-1, -2], [-1, 2], [-2, -1], [-2, 1]];
    for (var i = 0; i < alternations.length; i++) {
        var alteration = alternations[i];
        var candidate = chess.moveUtils.alterSquareByRowsAndRanks(this.square_, alteration[0], alteration[1]);

        if (chess.moveUtils.squareExists(candidate)
            && this.board_.getPieceOnSquare(candidate) === (this.white_ ? 'N' : 'n')) {
            candidates.push(candidate);
        }
    }

    this._commonMovingOrCaptureWithNBRQK_("Knight", "n", candidates);
}

/**
 * Sample moves:
 * Bxd7
 * Bexd7
 *
 * @private
 */
chess.Move.prototype.moveOrCaptureWithBishop_ = function() {
    var candidates = chess.moveUtils.getDiagonalCandidates(this, (this.white_ ? 'B' : 'b'));

    this._commonMovingOrCaptureWithNBRQK_("Bishop", "b", candidates);
}

/** @private */
chess.Move.prototype.moveOrCaptureWithRook_ = function() {
    var candidates = chess.moveUtils.getHorizontalCandidates(this, (this.white_ ? 'R' : 'r'));
    candidates = candidates.concat(chess.moveUtils.getVerticalCandidates(this, (this.white_ ? 'R' : 'r')));

    this._commonMovingOrCaptureWithNBRQK_("Rook", "r", candidates);
}

/** @private */
chess.Move.prototype.moveOrCaptureWithQueen_ = function() {
    var candidates = chess.moveUtils.getDiagonalCandidates(this, (this.white_ ? 'Q' : 'q'));
    candidates = candidates.concat(chess.moveUtils.getHorizontalCandidates(this, (this.white_ ? 'Q' : 'q')));
    candidates = candidates.concat(chess.moveUtils.getVerticalCandidates(this, (this.white_ ? 'Q' : 'q')));

    this._commonMovingOrCaptureWithNBRQK_("Queen", "q", candidates);
}

/** @private */
chess.Move.prototype.moveOrCaptureWithKing_ = function() {
    var candidates = chess.moveUtils.getDiagonalCandidates(this, (this.white_ ? 'K' : 'k'));
    candidates = candidates.concat(chess.moveUtils.getHorizontalCandidates(this, (this.white_ ? 'K' : 'k')));
    candidates = candidates.concat(chess.moveUtils.getVerticalCandidates(this, (this.white_ ? 'K' : 'k')));

    this._commonMovingOrCaptureWithNBRQK_("King", "k", candidates);
}

/**
 * @param {string} pieceName "Queen", "Rook", etc. Only used for debugging.
 * @param {string} pieceLetter Case insensitive. One of BNRQ.
 * @param {array} candidates
 * @private
 */
chess.Move.prototype._commonMovingOrCaptureWithNBRQK_ = function(pieceName, pieceLetter, candidates) {
    chess.log("Move or capture with " + pieceName + ": " + this.move_);

    var fromSquare = null;

    if (candidates.length === 1) {
        fromSquare = candidates[0];
    } else if (candidates.length > 1) {
        // The "e" in "Nef7" or the "7" in "N7d5" will determine which candidate is correct.
        var ambiguityLetter = /^[NBRQ]([a-h1-8])[a-hx]/.exec(this.move_);
        if (ambiguityLetter && ambiguityLetter.length == 2) {
            ambiguityLetter = ambiguityLetter[1];

            for (var i = 0; i < candidates.length; i++) {
                var candidate = candidates[i];
                if (ambiguityLetter == candidate[0] || ambiguityLetter == candidate[1]) {
                    fromSquare = candidate;
                    break;
                }
            }
        } else {
            throw "No ambiguity letter for " + this.move_ + ". Candidates are: " + candidates;
        }
    }

    if (fromSquare == null) {
        throw "No 'fromSquare' for " + pieceName + ". Candidates are: " + candidates;
    }

    this.board_.setPieceOnSquare(null, fromSquare);
    this.board_.setPieceOnSquare((this.white_ ? pieceLetter.toUpperCase() : pieceLetter.toLowerCase()), this.square_);
}

/** @private */
chess.Move.prototype.captureWithPawn_ = function() {
    chess.log("Capture with pawn: " + this.move_);

    var fromRank = parseInt(this.move_[3], 10) + (this.white_ ? -1 : 1);
    var fromSquare = this.move_[0] + fromRank;

    // En-passant
    if (!this.board_.isSquareOccupied(this.square_)) {
        this.board_.setPieceOnSquare(null, this.square_[0] + fromRank);
    }

    this.board_.setPieceOnSquare(null, fromSquare);
    this.board_.setPieceOnSquare(this.white_ ? 'P' : 'p', this.square_);
}

/** @private */
chess.Move.prototype.movePawn_ = function() {
    chess.log("Move pawn: " + this.move_);

    var toRank = parseInt(this.move_[1], 10);

    // To find the "from" square, we must check if 1 back is occupied, else it must be 2 back.
    var fromRank = toRank += (this.white_ ? -1 : 1);
    var fromSquare = this.move_[0] + fromRank;
    if (!this.board_.isSquareOccupied(fromSquare)) {
        fromRank += (this.white_ ? -1 : 1);
        fromSquare = this.move_[0] + fromRank;
    }

    var pawnLetter = this.white_ ? 'P' : 'p';

    this.board_.setPieceOnSquare(null, fromSquare);
    this.board_.setPieceOnSquare(pawnLetter, this.square_);
}

/** @private @type {string} */
chess.Move.prototype.move_ = null;

/** The square being moved to. @private @type {string} */
chess.Move.prototype.square_ = null;

/** @private @type {string} */
chess.Move.prototype.color_ = null;

/** @priate @type {boolean} An easier way of writing "this.color_ === 'w'" */
chess.Move.prototype.white_ = null;

/** @private @type {chess.Board} */
chess.Move.prototype.board_ = null;

chess.moveUtils = {
    getHorizontalCandidates: function(move, piece) {
        var r = chess.moveUtils.loop(1, 0, move, piece);
        r = r.concat(chess.moveUtils.loop(-1, 0, move, piece));
        return r;
    },

    getVerticalCandidates: function(move, piece) {
        var r = chess.moveUtils.loop(0, 1, move, piece);
        r = r.concat(chess.moveUtils.loop(0, -1, move, piece));
        return r;
    },

    getDiagonalCandidates: function(move, piece) {
        var r = [];
        // Left to right, above "square" (e5-h8)
        r = r.concat(chess.moveUtils.loop(1, 1, move, piece));
        // Right to left, above "square" (d5-a8).
        r = r.concat(chess.moveUtils.loop(1, -1, move, piece));
        // Left to right, below "square" (e4-h1)
        r = r.concat(chess.moveUtils.loop(-1, 1, move, piece));
        // Right to left, below "square" (d4-a1)
        r = r.concat(chess.moveUtils.loop(-1, -1, move, piece));
        return r;
    },

    loop: function(rowMultiplier, rankMultiplier, move, piece) {
        var candidates = [];

        for (var i = 1; i < 8; i++) {
            var candidate = chess.moveUtils.alterSquareByRowsAndRanks(move.square_, i * rowMultiplier, i * rankMultiplier),
            exists = chess.moveUtils.squareExists(candidate),
            squarePiece = (exists ? move.board_.getPieceOnSquare(candidate) : null);

            if (exists && squarePiece === piece) {
                candidates.push(candidate);
                break;
            } else if (exists && squarePiece === null) {
                continue;
            } else {
                // Blocked or now outside the board.
                break;
            }
        }

        return candidates;
    },

    /**
     * @return {boolean} If the square is in the box a1-h8.
     */
    squareExists: function(square) {
        return /^[a-h][1-8]$/.test(square);
    },

    /**
     * @param {string} square
     * @param {int} rows May be positive/negative.
     * @param {int} ranks May be positive/negative.
     * @return {string} The new square.
     */
    alterSquareByRowsAndRanks: function(square, rows, ranks) {
        if (!square) {
            throw "Square param requried";
        }

        var newRow = String.fromCharCode(square.charCodeAt(0) + rows);
        var newRank = parseInt(square[1], 10) + ranks;
        return newRow + newRank;
    }
}
