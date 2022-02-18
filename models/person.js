const mongoose = require("mongoose");
const dotenv = require("dotenv").config({path: '.env'});
const uniqueValidator = require("mongoose-unique-validator");

const url = process.env.MONGODB_URI;


mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log(error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (name) => name.length > 3,
      message: (props) => `${props.value} is not a valid name!`,
    },
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: (number) => number.length > 8,
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

personSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Person", personSchema);
