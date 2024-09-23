import { CraftIoServer, StatusCodes, type RouteContext} from "./server";

const server = new CraftIoServer(3000);

server.addRoute('/hello/:name', (context: RouteContext<any, {name: string}>) => {
    const { res, params } = context;
    const name = params.name || 'world';
    server.return(res, StatusCodes.OK, { message: `Hello, ${name}!` });
})

server.addRoute('/hello', (context: RouteContext<any, any, {name: string}>) => {
    const { res, query } = context;
    server.return(res, StatusCodes.OK, { message: `Hello, ${query.name || 'world'}!` });
})

server.addRoute('/', (context: RouteContext) => {
    const { res } = context;
    server.return(res, StatusCodes.OK, { message: 'Hello, World!' });
})

server.start();