const port = 3000

const express = require('express')
const bodyParser = require('body-parser')
const watson = require('watson-developer-cloud')
const watsonAuth = require('./watson-auth')

const app = express()
app.use(bodyParser.json())

const assistant = new watson.AssistantV1({
  username: watsonAuth.username,
  password: watsonAuth.password,
  url: 'https://gateway.watsonplatform.net/conversation/api/',
  version: '2018-02-16'
})

app.get('/', (req, res) => {
  return res.sendFile(__dirname + '/public/index.html')
})

app.post('/dialog', (req, res) => {
  const { message } = req.body

  assistant.message(
    {
      input: { text: message },
      workspace_id: watsonAuth.workspace_id
    },
    (err, response) => {
      if (err) {
        return res.json({ err })
      } else {
        console.log(response)
        const { output } = response
        return res.json(output.text)
      }
    }
  )
})

app.listen(port, () => {
  console.log(`Running on port ${port}`)
})