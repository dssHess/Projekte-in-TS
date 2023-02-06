const fs = require("fs")
const express = require('express')
const app = express()

const hostname = "0.0.0.0"
const port = 3000
const glittsFile = "./glitts.json"

app.get('/', (request, response) => {
    // Parameter aus der Anfrage auslesen
    const id = request.query.id
    console.log(id)

    // Datenbankaufruf mit dem Parameter
    const glitts = readGlittsFromFile()

    // Zurückschicken
    response.send(glitts)
})

app.post('/', (req, res) => {
    res.send('Alle Glits')
})


app.listen(port, () => {
    console.log(`Diese App überwacht den Port ${port}`)
})


class Glitt {
    user;
    text;
    datetime;

    constructor(data) {
        this.user = data.user;
        this.text = data.text;
        this.datetime = data.datetime;
    }
}

function readGlittsFromFile() {
    try {
        const dataBuffer = fs.readFileSync(glittsFile)
        const data = dataBuffer.toString()
        const json = JSON.parse(data)
        return json
    } catch (e) {
        return []
    }
}

/*const startApp = async () => {
    const server = express.server({
        port: port,
        host: hostname,
        routes: {
            cors: {
                origin: ["*"]
            }
        }
    })

    await server.start();
    console.log("Server läuft auf %s", server.info.uri);

    server.route({
        method: "GET",
        path: "/glitts",
        handler: (request, reply) => {
            return readGlittsFromFile().reverse()
        }
    })

    server.route({
        method: "POST",
        path: "/glitts",
        handler: (request, response) => {
            const glitts = readGlittsFromFile();
            const glitt = new Glitt(request.payload);
            glitts.push(glitt)
            fs.writeFileSync(glittsFile, JSON.stringify(glitts))
            return response.response(glitt).code(201)
        }
    })
}*/

//startApp();