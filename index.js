const express = require("express");
// const { request } = require("http");
const app = express();

app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Deez Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// info for the perons page
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const singleE = persons.find((singleE) => singleE.id === id);

  if (singleE) {
    response.json(singleE);
  } else {
    response.status(404).end();
  }
});
//can delete things
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});
//function for ID RNG
const generateId = (IdMax) => Math.floor(Math.random() * IdMax);

//posting stuff
app.post("/api/persons", (request, response) => 
{
  const body = request.body;
  // error parameters for name
  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }
  //error parameters for number
  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }
  //posting parameters
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(99999999999999),
  };
  //makes sure no duplicate names
  for (i = 0; i < persons.length; i++) {
    if (!body.name == persons[i].name) {
      return response.status(400).json({
        error: "name must be unique",
      });
    }
  }
  persons = persons.concat(person)
  response.json(person)
});
//info page

app.get("/info", (request, response) => {
  const info = persons.length;
  const now = new Date();
  response.send(`Phonebook has info for  ${info} people <br>${now}`);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
