import { model, Schema } from 'mongoose'

// Crea un modelo de usuario
const fileSchema = new Schema({
  name: String,
  fieldname: String,
  originalname: String,
  encoding: String,
  mimetype: String,
  buffer: Buffer
})

const File = model('image', fileSchema)

export default File
