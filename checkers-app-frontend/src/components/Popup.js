import React from "react";
import Winner from "./winner.svg";
import { Image } from "react-bootstrap";

function Popup({ shown, close, message, name="" }) {
  return (
    <div className={shown ? "pop" : "hidden"} onClick={close}>
      <div className="internal text-center my-5">
        {name===""? <>
          <h4>About Game</h4>
          <pre style={{ whiteSpace: "break-spaces", textAlign: "left", fontSize:".95em" }}>
            {message}
          </pre>
        </>:
          <>
            <Image src={Winner} style={{ width: "100px" }} />
            <h2>{name}</h2>
            <hr/>
            <h3>{message}</h3>
            <a href="#" onClick={()=>window.location="/"} className="mt-2">
              Start Again
            </a>
          </>
        }
        <button type="button" onClick={close} className="close">
          x Close
        </button>
      </div>
    </div>
  );
}

export default Popup;
