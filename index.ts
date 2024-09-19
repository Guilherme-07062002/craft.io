import { CraftIoServer } from "./server";

const server = new CraftIoServer();
server.start();

server.addRoute('/', (req, res) => {
    res.end('Hello, World!')
})