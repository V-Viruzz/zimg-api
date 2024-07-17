import express, { urlencoded, json } from 'express'
import mycors from 'cors'
import multer from 'multer'
import sharp from 'sharp'
import { config } from 'dotenv'
import File from './models/saveFile.js'
import ServerConnection from './database.js'

// Configura la conexión a MongoDB Atlas
config()

ServerConnection()

const upload = multer()
const app = express()
const port = process.env.PORT || 3001
const URL = process.env.URL_FRONTEND

app.use(
  urlencoded({
    extended: true
  })
)

app.use(
  mycors({
    origin: URL,
    // optionsSuccessStatus: 200,
    methods: ['GET', 'POST']
  })
)

// Cuando te hagan un post http://localhost:3000/transactions
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file
  console.log(file)

  if (!file) return res.status(400).send('No file uploaded.')

  const newFile = new File({
    name: 'nameImage',
    ...file
  })

  newFile
    .save()
    .then(() => console.log('File saved!'))
    .then(() => {
      res.send({
        message: 'File uploaded successfully.',
        filename: file.originalname,
        id: newFile._id
      })
    })
    .catch(err => console.error('Error saving file', err))
})

app.post('/props', json(), async (req, res) => {
  try {
    const props = req.body
    console.log(props)

    const data = await File.findOne({ _id: `${props.id}` })
    const buffer = Buffer.from(data.buffer)

    const resolution = { width: props.width, height: props.height }

    // Hacer lo que necesites con el buffer de la imagen
    sharp(buffer, { animated: props.format === 'gif' || props.format === 'webp' })
      .resize(resolution)
      .toBuffer((err, data, info) => {
        if (err) return console.log(err)

        res.send(data)
      })
  } catch (err) {
    console.error(err)
  }
})

app.listen(port, () => {
  console.log(`Estoy ejecutandome en http://localhost:${port}`)
})
