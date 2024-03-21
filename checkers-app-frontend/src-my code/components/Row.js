import React from "react";
import Cell from "./Cell";

// const Row = ({ rowArr, handlePieceClick, rowIndex, isDisabled }) => {
//   return (
//     <div className="row">
//       {rowArr.map((cell, index) => (
//         <div
//           className={`cell ${cell}`}
//           onClick={!isDisabled ? () => handlePieceClick(rowIndex, index) : null}
//           data-row={rowIndex}
//           data-cell={index}
//           data-piece={cell}
//           key={index}
//         />
//       ))}
//     </div>
//   );
// };

// export default Row;

function Row(props) {
  return (
    <div className="row_board">
      {props.rowArr.map((cell, index) => (
        <Cell
          key={index}
          rowIndex={props.rowIndex}
          index={index}
          cell={cell}
          handlePieceClick={!props.isDisabled ? props.handlePieceClick : null}
        />
      ))}
    </div>
  );
}

export default Row;
