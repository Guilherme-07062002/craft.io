import { Server } from 'http'


export class CraftIoServer {
    private readonly server: Server
    constructor() {
        this.server = new Server()
    }

    addRoute(path: string, handler: (req, res) => void) {
        this.server.on('request', (req, res) => {
            if (req.url === path) handler(req, res)
        })
    }

    start() {
      this.server.listen(3000, () => {
        console.log('Server is running on port 3000')
      })
    }
}