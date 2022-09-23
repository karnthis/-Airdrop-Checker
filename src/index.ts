import express from 'express'
import { Pool } from 'pg'
import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'

dotenv.config()
const app = express()
const pgPool = new Pool()

app.use(bodyParser.urlencoded())

const { PORT } = process.env
const usedPort = Number(PORT) || 3000

app.get('/', function (req, res) {
  const rewardsQuery = `
    SELECT * FROM Atom_Airdrop WHERE cosmosID = '$1'
    UNION
    SELECT * FROM Juno_Airdrop WHERE junoID = '$2'
    UNION
    SELECT * FROM Secret_Airdrop WHERE secretID = '$3'
  `
  const alphaQuery = `
    SELECT * FROM Testnet_Airdrop WHERE secretID = '$1'
  `
  const betaQuery = `
    SELECT * FROM Beta_Airdrop WHERE cosmosID = '$1'
  `
  pgPool
    .connect()
    .then(client => {
      return client
        .query(rewardsQuery, [])
        .then(records => {
          client.release()
          res.send(records)
        })
        .catch(err => {
          client.release()
          console.log(err)
          res.error(err)
        })
    })
})

app.listen(usedPort, function () {
    console.log(`Server is listening at port ${ usedPort }`)
})
