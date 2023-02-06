const fs = require("fs")
const hapi = require("@hapi/hapi")

const hostname = "0.0.0.0"
const port = 4000
const glittsFile = "./glitts.json"

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

const startApp = async () => {
    const server = hapi.server({
        port: port,
        host: hostname,
        routes: {
            cors: {
                origin: ["*"]
            }
        }
    })

    await server.start();
    console.log("Server running on %s", server.info.uri);

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
}

startApp();