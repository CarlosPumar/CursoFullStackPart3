import React, { useState, useEffect } from "react";
import Numbers from "./Numbers";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import personService from "../services/persons";
import Message from "./Message";

const App = () => {
  // Use states
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [message, setMessage] = useState({});

  // Use effect
  useEffect(() => {
    personService.getAll().then((personsGet) => {
      setPersons(personsGet);
      setFilteredPersons(personsGet);
    });
  }, []);

  //handlers on change
  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNewNumberChange = (event) => setNewNumber(event.target.value);
  const handleFilterChange = (event) =>
    filterByValue(event.target.value, persons);

  //handle submit
  const handleSubmitClick = (event) => {
    event.preventDefault();
    let newElement = { name: newName, number: newNumber };
    const rep = isRepeated(newElement);

    if (
      rep !== false &&
      window.confirm(`Do you want to update ${rep.name} with other number`)
    ) {
      newElement = { ...rep, number: newNumber };
      personService
        .update(newElement, newElement.id)
        .then((updatePerson) => {
          let newPersons = persons.filter(
            (person) => parseInt(person.id) !== parseInt(updatePerson.id)
          );
          newPersons = newPersons.concat(updatePerson);
          setPersons(newPersons);
          filterByValue(newFilter, newPersons);
          showMessage(`Update ${updatePerson.name}`);
        })
        .catch((error) => {
          console.log("update fail");
          showMessage(error.response.data.error, true);
        });
    }

    if (!rep) {
      personService
        .create(newElement)
        .then((newPerson) => {
          const newPersons = persons.concat(newPerson);
          setPersons(newPersons);
          filterByValue(newFilter, newPersons);
          showMessage(`Created ${newPerson.name}`);
        })
        .catch((error) => {
          console.log("create fail");
          showMessage(error.response.data.error, (error = true));
        });
    }

    setNewNumber("");
    setNewName("");
  };

  //handle remove
  const handleRemove = (event) => {
    const removeElement = persons.find(
      (element) => parseInt(element.id) === parseInt(event.target.id)
    );

    if (window.confirm(`Do you want to remove ${removeElement.name}?`)) {
      personService
        .remove(removeElement.id)
        .then((removedPerson) => {
          const newPersons = persons.filter(
            (element) => element.id !== removeElement.id
          );
          setPersons(newPersons);
          filterByValue(newFilter, newPersons);
          showMessage(`Removed ${removeElement.name}`);
        })
        .catch((error) => {
          console.log("remove fail");
          showMessage(error.response.data.error, (error = true));
        });
    }
  };

  //Auxiliar function
  const filterByValue = (value, persons) => {
    const newFilteredPersons = persons.filter((person) => {
      return person.name.toLowerCase().includes(value.toLocaleLowerCase());
    });
    setNewFilter(value);
    setFilteredPersons(newFilteredPersons);
  };

  //proves if new name is repetead or not
  const isRepeated = (newElement) => {
    let isrep = false;
    let returnElement = null;

    persons.forEach((element) => {
      if (element.name === newElement.name) {
        isrep = true;
        returnElement = element;
      }
    });

    if (isrep) {
      return returnElement;
    }

    return false;
  };

  //Message
  const showMessage = (txt, error = false, time = 3000) => {
    setMessage({ txt, error });
    setTimeout(() => {
      setMessage({});
    }, time);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Message message={message} />
      <Filter value={newFilter} handler={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        name={newName}
        number={newNumber}
        handleNameChange={handleNameChange}
        handleNewNumberChange={handleNewNumberChange}
        handleSubmitClick={handleSubmitClick}
      />
      <h2>Numbers</h2>
      <Numbers persons={filteredPersons} handleRemove={handleRemove} />
    </div>
  );
};

export default App;
