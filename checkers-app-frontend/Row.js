import React from 'react';
import Cell from './Cell';

function Row(props) {
    return (
        <div className="row_board">
            {props.rowArr.map((cell, index) => (
                <Cell
                    key={index}
                    rowIndex={props.rowIndex}
                    index={index}
                    cell={cell}
                    handlePieceClick={props.handlePieceClick}
                />
            ))}
        </div>
    );
}

export default Row;
