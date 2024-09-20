import { IncomingMessage, ServerResponse } from 'http'

import { CraftIoServer, StatusCodes, type QueryParams} from "./server";

const server = new CraftIoServer(3000);

server.addRoute('/', (req: IncomingMessage, res: ServerResponse) => {
    server.return(res, StatusCodes.OK, { message: 'Hello, World!' });
})

server.addRoute('/hello', (
    req: IncomingMessage, 
    res: ServerResponse, 
    query: QueryParams
) => {
    server.return(res, StatusCodes.OK, { message: `Hello, ${query.name}!` });
})

server.start();