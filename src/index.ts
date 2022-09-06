import express from 'express'
import mysql from 'mysql'
import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'

dotenv.config()
const app = express()

app.use(bodyParser.urlencoded())

const {
    PORT,
    USER,
    PASSWORD,
    SERVER,
    DATABASE
} = process.env
const usedPort = Number(PORT) || 3000

const mysqlConfig = {
    user: USER,
    password: PASSWORD,
    server: SERVER,
    database: DATABASE
};

app.get('/', function (req, res) {
    mysql.connect(mysqlConfig, function (err) {
        if (err) {
            console.log(err)
            res.error(err)
        } else {
            const mysqlRequest = new mysql.Request()

            mysqlRequest.query(
              `select * 
                from example 
                where Secret_address = '${req.body.Secret_address}'
                or Juno_address = '${req.body.Juno_address}'
                or Atom_address = '${req.body.Atom_address}'`,
              function (err, records) {
                  if (err) {
                      console.log(err)
                      res.error(err)
                  } else {
                      res.send(records)
                  }
              })
        }
    })
})

app.listen(usedPort, function () {
    console.log(`Server is listening at port ${ usedPort }`)
})