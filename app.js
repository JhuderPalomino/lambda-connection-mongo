'use strict';
const mongoose = require('mongoose');
/* const { connectDatabase } = require('./database');

 */
const {DB_URL} = require('./config')


let cachedMongoConn = null;

 const connectDatabase = () => {
    return new Promise((resolve, reject) => {
    
    mongoose.connection
      // Reject if an error occurred when trying to connect to MongoDB
      .on('error', error => {
        console.log('Error: connection to DB failed');
        reject(error);
      })
      // Exit Process if there is no longer a Database Connection
      .on('close', () => {
        console.log('Error: Connection to DB lost');
        process.exit(1);
      })
      // Connected to DB
      .once('open', () => {
        // Display connection information
        const infos = mongoose.connections;

        infos.map(info => console.log(`Connected to ${info.host}:${info.port}/${info.name}`));
        // Return successful promise
        resolve(cachedMongoConn);
      });


    if (!cachedMongoConn) {
      cachedMongoConn = mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false // and MongoDB driver buffering
      });
    } else {
      console.log('MongoDB: using cached database instance');
      resolve(cachedMongoConn);
    }
  });
}



module.exports.handler = async (event) => {

  console.log('Connecting to database...');
  connectDatabase()
    .then(() => console.error('>CONECT'))

    .catch(error => {
      console.error('>COULD NOT CONECT');
      throw error;
      
    });
  
    return {
      statusCode: 200,
      body: JSON.stringify({
          
      })
      }
};
