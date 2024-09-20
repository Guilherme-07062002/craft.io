import { Server, IncomingMessage, ServerResponse } from 'http'

export class CraftIoServer {
    private readonly server: Server
    private readonly routes: Map<string, Handler> = new Map()

    constructor(private readonly port: number = 3000) {
        this.server = new Server()
    }

    /**
     * Add a route to the server
     */
    addRoute(path: string, handler: Handler) {
        if (this.routes.has(path)) {
            throw new Error(`Route ${path} already exists`)
        }
        this.routes.set(path, handler)
    }
    
    /**
     * Start the server
     */
    start() {
        this.server.on('request', (req, res) => {
            try {
                const handler = this.routes.get(req.url || '')
                if (handler) {
                    handler(req, res)
                } else {
                    this.return(res, StatusCodes.NOT_FOUND, { message: 'Endpoint not found' })
                }
            } catch (error) {
                this.return(res, StatusCodes.INTERNAL_SERVER_ERROR, { message: 'Internal server error' })
            }
        })

        this.server.listen(this.port, () => {
        console.log(`Server is running on port ${this.port}`)
      })
    }

    /**
     * Return a response
     */
    return(response: ServerResponse, statusCode: number, body: any, contentType: string = 'application/json') {
        response.setHeader('Content-Type', contentType);
        response.statusCode = statusCode;

        const payloadBody = contentType === 'application/json' ? JSON.stringify(body) : body;
        response.end(payloadBody);
    }
}

export const StatusCodes = {
    OK: 200,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
}

export type Handler = (req: IncomingMessage, res: ServerResponse) => void
