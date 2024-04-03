import { error } from 'console';
import app from './app.js';
import { connectToDatabase } from './db/connection.js';

// connections and listeners 
const PORT = process.env.PORT || 5000;
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => console.log('Server open and connected to the database'))
  })
  .catch((error) => console.log(error));
