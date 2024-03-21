import React from "react";

function Popup({ shown, close, copy }) {
  return (
    <div className={shown ? "pop" : "hidden"} onClick={close}>
      <div className="internal">
        <pre style={{ whiteSpace: "break-spaces", textAlign: "left" }}>
          {copy}
        </pre>
        <button type="button" onClick={close} className="close">
          x Close
        </button>
      </div>
    </div>
  );
}

export default Popup;
