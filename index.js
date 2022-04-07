//packages or middleware or some shit
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(cors());
// app.use(morgan("tiny"));
// can't use this and a custom token apparently
app.use(express.json());
///have morgan return data in a post request
morgan.token('DEEZ',  (req) => {
	if (req.method === 'POST')
	{
		return JSON.stringify(req.body);
	} else {
		return null;
	}
});
app.use(morgan(':DEEZ'));

//data
let persons = [
	{
		id: 1,
		name: 'Arto Hellas',
		number: '040-123456',
	},
	{
		id: 2,
		name: 'Ada Lovelace',
		number: '39-44-5323523',
	},
	{
		id: 3,
		name: 'Deez Abramov',
		number: '12-43-234345',
	},
	{
		id: 4,
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
	},
];
//info page

app.get('/info', (request, response) => {
	const info = persons.length;
	const now = new Date();
	response.send(`Phonebook has info for  ${info} people <br>${now}`);
});

// info for the perons page
app.get('/api/persons', (request, response) => {
	response.json(persons);
});
//output a single entr
app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	const singleE = persons.find((singleE) => singleE.id === id);

	if (singleE) {
		response.json(singleE);
	} else {
		response.status(404).end();
	}
});
//can delete things
app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter((person) => person.id !== id);
	response.status(204).end();
});
//function for ID RNG
const generateId = (IdMax) => Math.floor(Math.random() * IdMax);

//posting stuff
app.post('/api/persons', (request, response) =>
{
	const body = request.body;
	// error conditions for name
	if (!body.name) {
		return response.status(400).json({
			error: 'name missing',
		});
	}
	//error conditions for number
	if (!body.number) {
		return response.status(400).json({
			error: 'number missing',
		});
	}
	//posting parameters
	const person = {
		name: body.name,
		number: body.number,
		id: generateId(99999999999999),
	};
	//makes sure no duplicate names
	for (let i = 0; i < persons.length; i++) {
		if (body.name == persons[i].name) {
			return response.status(400).json({
				error: 'name must be unique',
			});
		}
	}
	//adds the new person to the persons array
	persons = persons.concat(person);
	//sends the person as the response from the server
	response.json(person);
});

//sets up the port for the server
const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
