import React from 'react';

function Cell(props) {
    const cellC = props.cell.split("-");
    return (
        <div className={'cell cell-' + cellC[0]}>
            <div
                onClick={props.handlePieceClick}
                data-row={props.rowIndex}
                data-cell={props.index}
                data-piece={cellC[1]}
                data-player={cellC[1]}
                className={`gamePiece${((props.rowIndex % 2 === 0 && props.index % 2 === 0) || (props.rowIndex % 2 !== 0 && props.index % 2 !== 0)) ? ' is-disabled' : ''}`}
            ></div>
        </div>
    );
}

export default Cell;
