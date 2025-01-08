const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

module.exports = async () => {
  try {
    // let db = await mongoose.connect('mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_DATABASE, {
    //   auth: {
    //     username: process.env.DB_USERNAME,
    //     password: process.env.DB_PASSWORD
    //   },
    //   // useCreateIndex: true,
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   // useFindAndModify: false
    // });
    let db = await mongoose.connect('mongodb+srv://skm:A1FAVzNsY8X6zZ9Q@cluster0.whghyhm.mongodb.net/WTS_DB')
    global.dbUrl = db.connections[0].db;
    // console.log('DB connected successfully');
  } catch (error) {
    console.error(error);
  }
}

mongoose.connection.on('connected', () => {
  console.log('DB has connected succesfully')
})
mongoose.connection.on('reconnected', () => {
  console.log('DB has reconnected')
})
mongoose.connection.on('error', error => {
  console.log('DB connection has an error', error)
  mongoose.disconnect()
})
mongoose.connection.on('disconnected', () => {
  console.log('DB connection is disconnected')
})