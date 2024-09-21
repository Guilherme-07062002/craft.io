import { IncomingMessage, ServerResponse } from 'http'

import { CraftIoServer, StatusCodes, type Params, type QueryParams} from "./server";

const server = new CraftIoServer(3000);

server.addRoute('/hello/:name', (
    req: IncomingMessage, 
    res: ServerResponse, 
    query: QueryParams,
    params: Params,
    body: any
) => {
    server.return(res, StatusCodes.OK, { message: `Hello, ${params.name || 'world'}!` });
})

server.addRoute('/hello', (
    req: IncomingMessage, 
    res: ServerResponse, 
    query: QueryParams
) => {
    server.return(res, StatusCodes.OK, { message: `Hello, ${query.name || 'world'}!` });
})

server.addRoute('/', (req: IncomingMessage, res: ServerResponse) => {
    server.return(res, StatusCodes.OK, { message: 'Hello, World!' });
})

server.start();