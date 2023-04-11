import mongoose from 'mongoose'

// Configura la conexión a MongoDB Atlas
function ServerConnection () {
  mongoose.connect(
   `mongodb+srv://Viruz:${process.env.MONGODB_PASSWORD}@zimg-database.4gqeovi.mongodb.net/${process.env.MONGODB_DB}?retryWrites=true&w=majority`
  ).then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error(err))
}

export default ServerConnection
