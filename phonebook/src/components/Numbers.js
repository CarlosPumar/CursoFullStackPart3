import React from "react";
import Number from "./Number";

const Numbers = ({ persons, handleRemove }) => {
  if (Object.keys(persons).length === 0) {
    return <>No coincidences</>;
  }

  return (
    <>
      {persons.map((person, i) => (
        <div key={i}>
          <Number person={person} />
          <button id={person.id} onClick={handleRemove}>
            delete
          </button>
        </div>
      ))}
    </>
  );
};

export default Numbers;
