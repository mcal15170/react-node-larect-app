import React from "react";

export function Loading() {
  return <div>Loading ...</div>;
}

export function Loader({ message, minute }) {
  return (
    <div>
      Message : {message}
      <br />
     reamaning  minute : {minute}
    </div>
  );
}
