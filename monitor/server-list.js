// Prints a list of fluent bit servers, formatted for Jenkins fluent bit job parameters
const fs = require('fs');

const testFolder = __dirname + '/../config/server/';

fs.readdir(testFolder, (err, files) => {
  let servers = '';
  files
    .filter(file => file !== 'localhost.json')
    .filter(file => file.endsWith('.json'))
    .map(file => file.slice(0, -5))
    .forEach(file => {
      servers += `'${file}', `;
    });
  console.log(servers.slice(0, -2));
});