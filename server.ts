import { Server, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';

export class CraftIoServer {
    private readonly server: Server;
    private readonly routes: Map<string, Handler> = new Map();

    constructor(private readonly port: number = 3000) {
        this.server = new Server();
    }

    /**
     * Add a route to the server
     */
    addRoute(path: string, handler: Handler) {
        if (this.routes.has(path)) throw new Error(`Route ${path} already exists`);
        this.routes.set(path, handler);
    }

    /**
     * Start the server
     */
    start() {
        console.log('='.repeat(50));
        console.log('Server is starting...\n');

        this.server.on('request', (req, res) => {
            const parsedUrl = parse(req.url || '', true);
            const pathname = parsedUrl.pathname || '';

            for (const [path, handler] of this.routes) { 
                if (path === pathname) {                    
                    handler(req, res, parsedUrl.query as QueryParams, {});
                    return;
                } else if (path.includes(':')) {
                    const params = this.extractParams(path, pathname);
                    if (params) {
                        handler(req, res, parsedUrl.query as QueryParams, params);
                        return;
                    }
                }
            }

            this.return(res, StatusCodes.NOT_FOUND, { message: 'Endpoint not found' });
        });

        this.server.listen(this.port, () => {
            console.log(`Server is running on port \x1b[31m${this.port}\x1b[0m`);
        });
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

    /**
     * Extract parameters from the URL
     */
    extractParams(path: string, route: string) {
        const pathParts = path.split('/').filter(Boolean);
        const routeParts = route.split('/').filter(Boolean);
        
        const params: Params = {};
      
        if (pathParts.length !== routeParts.length) return null;
      
        for (let i = 0; i < routeParts.length; i++) {
          if (pathParts[i].startsWith(':')) {
            const paramName = pathParts[i].replace(':', '') ;
            params[paramName] = routeParts[i];
          } else if (routeParts[i] !== pathParts[i]) return null; // Não é uma correspondência válida
        }
      
        return params;
    }
}

export const StatusCodes = {
    OK: 200,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

export type Handler = (
    req: IncomingMessage, 
    res: ServerResponse, 
    query: QueryParams,
    params: Params
) => void;

export type QueryParams = { [key: string]: string };
export type Params = { [key: string]: string };