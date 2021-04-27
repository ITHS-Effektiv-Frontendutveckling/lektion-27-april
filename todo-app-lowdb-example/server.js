/**
 * TODO API
 * 
 * Endpoints:
 * 
 * Hämta alla todos
 * URL: /api/todo
 * Method: GET
 * 
 * Lägg till en ny todo
 * URL: /api/todo
 * Method: POST
 * 
 * Ta bort en todo
 * URL: /api/todo/:id
 * Method: DELETE
 */

/**
 * Databas
 *
 * Vad är databasen till för?
 * Lägga till, hämta och ta bort todos
 * 
 * Vad vill vi spara för data?
 * Vi vill spara själva todo-texten och ett unik id till varje todo
 * 
 * Vad är det för typ av data vi vill spara?
 * En array med objekt. Varje objekt är en todo-item
 * 
 * Ex:
 * {
 *    todos: [
 *        {
 *           task: String
 *           id: String
 *        }
 *    ]
 * }
 */


const express = require('express');
const lowdb = require('lowdb');
const { nanoid } = require('nanoid');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('todos.json');
const database = lowdb(adapter);

const app = express();

app.use(express.json());

//Initirerar vår databas med en tom array
function initDatabase() {
  database.defaults({ todos: [] }).write();
}

app.post('/api/todo', (request, response) => {
  const todoItem = request.body;
  todoItem.id = nanoid(); //Genererar ett unikt id
  console.log('Todo att lägga till:', todoItem);
  const todos = database.get('todos').push(todoItem).write();
  console.log(todos);

  let result = {}
  
  result.success = true;
  result.todos = todos;

  response.json(result);
});

app.get('/api/todo', (request, response) => {
  const todos = database.get('todos').value();

  let result = {}

  if (todos.length > 0) {
    result.success = true;
    result.todos = todos;
  } else {
    result.success = false;
    result.message = 'Inga todos att hämta'
  }

  response.json(result);
});

app.delete('/api/todo/:id', (request, response) => {
  const todoId = request.params.id;
  const removedTodo = database.get('todos').remove({ id: todoId }).write();
  console.log('Tog bort:', removedTodo);

  let result = {};

  if (removedTodo.length > 0) {
    result.success = true;
  } else {
    result.success = false;
    result.message = 'Hittade ingen todo att ta bort med det id:et';
  }

  response.json(result);
});

app.listen(8000, () => {
  console.log('Server started');
  initDatabase();
});