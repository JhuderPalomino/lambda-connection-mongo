
const mongoose = require('mongoose');
const {DB_URL} = require('../config')



let cachedMongoConn = null;

 exports.connectDatabase = () => {
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
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        connectTimeoutMS: 10000,

        bufferCommands: false, // Disable mongoose buffering
        bufferMaxEntries: 0, // and MongoDB driver buffering
      });
    } else {
      console.log('MongoDB: using cached database instance');
      resolve(cachedMongoConn);
    }
  });
}

