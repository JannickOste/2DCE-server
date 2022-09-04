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
            socket.onopen
            if(Object.values(Server.clients).some((c: Client | null) => c !== null && c.match(socket)))
                return;

            console.log(`Client connection attempt: ${socket.url}`);
            for(let i = 1; i <= Server.MAX_CLIENTS; i++)
            {
                if(Server.clients[i] !== null) continue;
                
                socket.on("close", () => {
                    Server.clients[i] = null;
                    console.log("disconnect");
                });
                
                Server.clients[i] = new Client(i, socket);
                return;
            }

            socket.close();
        });
        

        console.log(`Websocket listening on port: ${Server.PORT}`);
        setInterval(this.Tick, 1000/60)
    }
    
    
    private Tick() 
    {
        const activeClients = Object.values(Server.clients).filter(i => i !== null);

        for(let client of activeClients)
        {
            if(!client) continue;

            // Send other players
            for(let otherClient of activeClients)
            {
                if(otherClient?.id != client?.id)
                    PacketHandler.SendPacket(client, {
                        id: ServerPacket.SET_PLAYER,
                        args: {
                            pid: otherClient?.id,
                            x: otherClient?.position.x,
                            y: otherClient?.position.y
                        }
                    })
            }
            
            // Send local
            PacketHandler.SendPacket(client, {
                id: ServerPacket.SET_PLAYER,
                args: {
                    pid: client.id,
                    x: client.position.x,
                    y: client.position.y
                }
            });

        }
    }
} 