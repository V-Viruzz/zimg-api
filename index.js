const express = require('express')
const mycors = require('cors')
const multer = require('multer')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const upload = multer({ dest: 'temp/' })
const app = express()
const port = 3000
const db = []

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(
  mycors({
    origin: '*',
    methods: ['GET', 'POST']
  })
)

// app.use(express.json({
//   type: '*/*'
// }))

// app.get('/test', (req, res) => {
//   res.send(JSON.stringify(db))
// })

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
    filename: file.filename
  })
})

app.post('/props', express.json(), (req, res) => {
  const props = req.body
  console.log(props)
  const pathRes = `temp\\${props.filename}`
  const pathSave = `./image/${props.filename}.${props.format}`
  const resolution = { width: props.width, height: props.height }

  fs.readFile(pathRes, (err, buffer) => {
    if (err) {
      console.error(err)
    }

    // Hacer lo que necesites con el buffer de la imagen
    sharp(buffer, { animated: props.format === 'gif' || props.format === 'webp' })
      .resize(resolution)
      .toFile(pathSave)
      .then(() => {
        console.log('first')
      })
  })

  const imagePath = path.join(__dirname, pathSave)
  res.sendFile(imagePath)
})

app.listen(port, () => {
  console.log(`Estoy ejecutandome en http://localhost:${port}`)
})

setInterval(() => {
  console.log('cleanup')
  db.forEach((item) => {
    const pathTemp = path.join(__dirname, `./temp/${item.filename}`)
    fs.unlink(pathTemp, (err) => {
      if (err) {
        console.error('Error al eliminar archivo:')
      }
    })
  })
}, 10 * 60 * 1000)
