import express, { urlencoded, json } from 'express'
import mycors from 'cors'
import multer from 'multer'
import sharp from 'sharp'

const upload = multer()
const app = express()
const port = process.env.PORT || 3000
// const URL = 'http://localhost:4000'
const URL = 'https://zimg-x.vercel.app'
const db = []

app.use(
  urlencoded({
    extended: true
  })
)

app.use(
  mycors({
    origin: URL,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST']
  })
)

// app.use(express.json({
//   type: '*/*'
// }))

// Cuando te hagan un post http://localhost:3000/transactions
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file
  db.push(file)
  console.log(file)

  if (!file) {
    res.status(400).send('No file uploaded.')
    return
  }

  res.send({
    message: 'File uploaded successfully.',
    filename: file.originalname
  })
})

app.post('/props', json(), (req, res) => {
  const props = req.body

  const resolution = { width: props.width, height: props.height }
  const image = db.find(item => item.originalname === props.filename)

  // Hacer lo que necesites con el buffer de la imagen
  sharp(image.buffer, { animated: props.format === 'gif' || props.format === 'webp' })
    .resize(resolution)
    .toBuffer((err, data, info) => {
      if (err) console.log(err)
      console.log('convert image buffer', info)

      res.send(data)
    })
})

app.listen(port, () => {
  console.log(`Estoy ejecutandome en http://localhost:${port}`)
})
