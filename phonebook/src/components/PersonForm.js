import React from "react";

const PersonForm = ({
  name,
  number,
  handleNameChange,
  handleNewNumberChange,
  handleSubmitClick,
}) => {
  return (
    <>
      <form>
        <div>
          name: <input value={name} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={number} onChange={handleNewNumberChange} />
        </div>
        <div>
          <button type="submit" onClick={handleSubmitClick}>
            add
          </button>
        </div>
      </form>
    </>
  );
};

export default PersonForm;
