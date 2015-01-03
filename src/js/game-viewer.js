var chess = chess || {};

/**
 * @constructor
 */
chess.GameViewer = function() {
    this.container_ = document.getElementById('game-viewer');
    this.halfMovesCount_ = this.container_.getAttribute('data-half-moves-count');
    this.currentHalfMoveNumber_ = 0;
    this.result_ = this.container_.getAttribute('data-result');
    this.setMoveListeners_();

    this.board_ = new chess.Board(document.getElementById('game-viewer-board'));
}

chess.log = function(message) {
    if (typeof console !== 'undefined') {
        console.log(message);
    }
}

/** @private */
chess.GameViewer.prototype.setMoveListeners_ = function() {
    var self = this;
    window.addEventListener('keyup', function(event) {
        self.onKeyPress_(event);
    }, true);
}

/** @private */
chess.GameViewer.prototype.onKeyPress_ = function(event) {
    var back = (event.which == 37 && false); // @todo - remove false once going back is complete.
    var forward = (event.which == 39);

    if (!back && !forward) {
        // Not a left/right arrow key.
        return;
    } else if (back && this.currentHalfMoveNumber_ === 0) {
        // Going back but already at the start.
        return;
    } else if (back && this.currentHalfMoveNumber_ === 1) {
        // Going back to start, just reset the board.
        this.board_.setToStartingPosition();
        this.currentHalfMoveNumber_ = 0;
        return;
    } else if (forward && this.currentHalfMoveNumber_ == this.halfMovesCount_) {
        // Going forward but already at the end.
        return;
    }

    // Remove "current" class from the previous move.
    var previousMoveEl = document.getElementById('game-viewer-move-' + this.currentHalfMoveNumber_);
    if (previousMoveEl != null) {
        previousMoveEl.setAttribute('class', '');
    }

    this.currentHalfMoveNumber_ += (forward ? 1 : -1);

    if (forward) {
        var moveEl = document.getElementById('game-viewer-move-' + this.currentHalfMoveNumber_);
        moveEl.setAttribute('class', 'current');

        var pieceMove = moveEl.textContent.replace(/^\s+/, '').replace(/\s+$/, '');
        var color = this.currentHalfMoveNumber_ % 2 == 0 ? 'b' : 'w';

        var move = new chess.Move(pieceMove, color, this.board_);
        move.go();
    } else {
        // @todo - implement going back.
        return;
    }
}

/** @private @type {HTMLElement} */
chess.GameViewer.prototype.container_ = null;

/** @private @type {GameViewer.Board} */
chess.GameViewer.prototype.board_ = null;

/** @private @type {string} */
chess.GameViewer.prototype.result_ = null;

/** @private @type {integer} */
chess.GameViewer.prototype.halfMovesCount_ = null;

/** @private @type {integer} */
chess.GameViewer.prototype.currentHalfMoveNumber_ = 0;
