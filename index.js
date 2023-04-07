const fs = require('fs')
const express = require('express')
const mycors = require('cors')
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const upload = multer()
const app = express()
const port = process.env.PORT || 3000
const db = []

let writeStream

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(
  mycors({
    origin: 'http://localhost:4000',
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST']
  })
)

// app.use(express.json({
//   type: '*/*'
// }))

// Cuando te hagan un post http://localhost:3000/transactions
app.post('/upload', upload.single('file'), (req, res) => {
  // res.set('Access-Control-Allow-Origin', 'http://localhost:4000')
  const file = req.file
  db.push(file)
  console.log(file)
  writeStream = fs.createWriteStream(`./tmp/${file.originalname}`)

  writeStream.on('finish', function () {
    console.log('leyendo')
  })

  if (!file) {
    res.status(400).send('No file uploaded.')
    return
  }

  res.send({
    message: 'File uploaded successfully.',
    filename: file.originalname
  })
})

app.post('/props', express.json(), (req, res) => {
  const props = req.body
  console.log(props.filename)
  const pathRes = `tmp\\${props.filename}`
  const pathSave = `./image/${props.filename}.${props.format}`
  const pathImage = path.join(__dirname, pathSave)
  const resolution = { width: props.width, height: props.height }

  const image = db.find(item => item.originalname === props.filename)
  console.log('Image buffer', image.buffer)
  // fs.readFile(pathRes, (err, buffer) => {
  // if (err) {
  //   console.error(err)
  // }

  // Hacer lo que necesites con el buffer de la imagen
  sharp(image.buffer, { animated: props.format === 'gif' || props.format === 'webp' })
    .resize(resolution)
    .toFile(pathSave)
    .then(() => res.sendFile(pathImage)
    )
  // })
})

app.listen(port, () => {
  console.log(`Estoy ejecutandome en http://localhost:${port}`)
})

// setInterval(() => {
//   console.log('cleanup')
//   db.forEach((item) => {
//     const pathTemp = path.join(__dirname, `./temp/${item.filename}`)
//     fs.unlink(pathTemp, (err) => {
//       if (err) {
//         console.error('Error al eliminar archivo:')
//       }
//     })
//   })
// }, 10 * 60 * 1000)
