const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Inserisci la password admin: ', async (password) => {
  const hash = await bcrypt.hash(password, 12);
  console.log('\nAggiungi questa riga nel file .env:\n');
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  rl.close();
});
