
import https from 'https'
import fs from 'fs'
import app from '../src/config/app'

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Example app listening on port ${process.env.PORT || 3000}! Go to http://localhost:/${process.env.PORT || 3000}/`
  )
})

process.on('uncaughtException', (err) => {
  console.log(err)
})


// https
//   .createServer(
//     {
//       key:  fs.readFileSync("server.key"),
//       cert: fs.readFileSync("server.cert"),
//     },
//     app
//   )
//   .listen(process.env.PORT || 3000, () => {
//     console.log(
//       `Example app listening on port ${process.env.PORT || 3000}! Go to https://localhost:${process.env.PORT || 3000}/`
//     );
//   });
