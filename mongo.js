const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

// Connect to database
const password = process.argv[2];
const database = "phonebook";

const url = `mongodb+srv://cpjim:${password}@cluster0.kaxey.mongodb.net/${database}?retryWrites=true&w=majority`;

mongoose.connect(url);

// Create Person Schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

// If only password is passed, show all
if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}

// Else add new person
if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const newPerson = new Person({
    name,
    number,
  });

  newPerson.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
