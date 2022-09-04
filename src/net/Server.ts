import * as ws from "ws";
import Client  from "./Client";
import ServerPacket from "./enums/ServerPacket";
import PacketHandler from "./PacketHandler";

export default class Server 
{
    private static readonly PORT = 8080;
    private static readonly MAX_CLIENTS = 2;
    private static clients: {[key: number]: Client | null} = {}
    private static websocket: any;

    public Start(): void
    {
        Server.websocket = new ws.Server({
            port: Server.PORT
        });

        Server.clients = Object.fromEntries(Array.from(Array(Server.MAX_CLIENTS).keys()).map(i => [i+1, null]));
        Server.websocket.on("connection", (socket: ws.WebSocket) => {
            console.log(`Client connection attempt: ${socket.url}`);
            for(let i = 1; i <= Server.MAX_CLIENTS; i++)
            {
                if(Server.clients[i] !== null) continue;
                
                socket.on("close", () => Server.clients[i] = null);
                Server.clients[i] = new Client(i, socket);
                return;
            }

            socket.close();
        });
        

        console.log(`Websocket listening on port: ${Server.PORT}`);
        setInterval(this.Tick, 1000/2)
    }
    
    
    private Tick() 
    {
        for(let client of Object.values(Server.clients))
        {
            if(client)
                PacketHandler.SendPacket(client, {
                    id: ServerPacket.SERVER_HELLO, 
                    args: {
                        i: "hello world"
                    }
                })
        }
    }
} 