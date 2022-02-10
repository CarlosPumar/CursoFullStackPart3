const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(cors());
app.use(express.json());

morgan.token("post-info", function (req, res) {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }

  return "";
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :post-info"
  )
);

let persons = [
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => parseInt(person.id) === parseInt(id));

  if (!person) {
    return response.status(404).end();
  }

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => parseInt(person.id) === parseInt(id));

  if (!person) {
    return response.status(404).end();
  }

  persons = persons.filter((person) => parseInt(person.id) !== parseInt(id));
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  let body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name and number are required",
    });
  }

  const existPerson = persons.find((person) => person.name === body.name);

  if (existPerson) {
    return response.status(400).json({
      error: "person already exists",
    });
  }

  const id = parseInt(Math.random() * 1000);
  console.log(id);
  const person = {
    name: body.name,
    number: body.number,
    id: id,
  };

  persons = persons.concat(person);
  response.json(person);
});

app.get("/info", (request, response) => {
  const dateStr = new Date().toString();
  response.send(`Phonebook has info for ${persons.length} people / ${dateStr}`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
