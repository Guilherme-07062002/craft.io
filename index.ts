import { IncomingMessage, ServerResponse } from 'http'

import { CraftIoServer, StatusCodes} from "./server";

const server = new CraftIoServer(3000);

server.addRoute('/', (req: IncomingMessage, res: ServerResponse) => {
    server.return(res, StatusCodes.OK, { message: 'Hello, World!' });
})

server.start();