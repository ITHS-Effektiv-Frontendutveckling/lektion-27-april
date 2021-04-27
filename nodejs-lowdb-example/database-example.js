const lowdb = require('lowdb');
//Importera en adapter för att skriva synkront till en databas för att undvika konflikter
const FileSync = require('lowdb/adapters/FileSync');

//Bestäm vilken JSON-fil som är vår databas, om den inte finns så skapas den av lowdb
const adapter = new FileSync('database.json');
//Koppla vår JSON-fil till lowdb
const database = lowdb(adapter);

/** Frågor att ställa sig vid skapandet av databasen
 * Vad är databasen till för? Vad är dess syfte?
 * Vad vill vi spara för data?
 * Vad är det för typ av data vi vill spara? (Arrayer, nummer, strängar, objekt etc)
 */

/**
 * Vad är databasen till för?
 * Syftet är att spara användarkonton.
 * 
 * Vad vill vi spara för data?
 * Vi vill spara användarnamn och lösenord
 * 
 * Vad är det för typ av data vi vill spara?
 * Det är en array med konton där varje konto är ett objekt
 * 
 * Exempel:
 *  {
 *    accounts: [
 *       {
 *          username: 'Chris'
 *          password: 'pwd123'
 *       }
 *    ]
 *  }
 */

database.defaults({ accounts: [] }).write();

const account = {
  username: 'Chris',
  password: 'pwd123'
}

//Hämta arrayen accounts, lägg till ett nytt objekt och skriv arrayen till databasen
database.get('accounts').push(account).write();

const accounts = database.get('accounts').value();
console.log('Databasen innehåller:', JSON.stringify(accounts));

//Hämta arrayen accounts, leta upp det första objektet som har användarnamn Chris
//Uppdatera sedan med ett nytt användarnamn och skriv till databasen
database.get('accounts').find({ username: 'Chris' }).assign({ username: 'Ada' }).write();

//Hämta alla konton med användarnamn Chris
const filterAccounts = database.get('accounts').filter({ username: 'Chris' }).value();
console.log('FilterAccounts:', JSON.stringify(filterAccounts));

//Hämta arrayen accounts, ta bort det objekt där användarnamn är lika med Test och
//skriv till databasen
database.get('accounts').remove({ username: 'Test' }).write();

//Hämtar arrayen accounts och skapar sedan en ny egenskap som heter count
//där vi skriver längden av arrayen (alltså hur många konton som finns)
const numberOfAccounts = database.get('accounts').value();
database.set('count', numberOfAccounts.length).write();

