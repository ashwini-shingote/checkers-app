import React from 'react';

function Cell(props) {
    const cellC = props.cell.split("-");
    const rowInd = props.rowIndex;
    return (
        <div className={`cell cell-${cellC[0]} ${cellC[0]==="r" && rowInd===0?"k": cellC[0]==="b" && rowInd===7?"k":""}`}>
            <div
                onClick={props.handlePieceClick}
                data-row={rowInd}
                data-cell={props.index}
                data-piece={cellC[1]}
                data-player={cellC[1]}
                className={`gamePiece${((rowInd % 2 === 0 && props.index % 2 === 0) || (rowInd % 2 !== 0 && props.index % 2 !== 0)) ? ' is-disabled' : ''}`}
            ></div>
        </div>
    );
}

export default Cell;
