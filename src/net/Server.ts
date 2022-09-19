import * as ws from "ws";
import { Player } from "../entities/characters/Player";
import GameEntity from "../entities/GameEntity";
import Client  from "./Client";
import ServerPacket from "./enums/ServerPacket";
import PacketHandler from "./PacketHandler";

export default class Server 
{
    private static readonly PORT = 8080;
    private static readonly MAX_CLIENTS = 2;
    private static clients: {[key: number]: Client | null} = {}
    public static get Clients(): {[key: number]: Client | null} { return this.clients}
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
                
                socket.on("close", async() => {
                    await Server.clients[i]?.Save();
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
        const groupBy = (set: any, param: (obj: any) => any) => 
        {
            let output: {[key: string | number]: any[]} = {}
            for(let i of set)
            {
                const value = param(i);
                if(output[value] === undefined)
                    output[value] = [i];
                else output[value].push(i);
            }

            return output;
        }

        /** Update entities */
        for(let entity of GameEntity.Entities.concat(Player.Players))
            if(entity)
                entity.Update();

        const activeClients: Client[] = Object.values(Server.clients).filter(i => i !== null && i.loggedIn) as Client[];
        const mappedClients = groupBy(activeClients, (i: Client) => i.player.map);
        for(let [mapId, clients] of Object.entries(mappedClients))
        {
            for(let client of clients)
            {
                // Send other players
                for(let otherClient of mappedClients[mapId])
                    PacketHandler.HandleServerPacket(client, ServerPacket.SET_PLAYER, otherClient);
                    
                PacketHandler.HandleServerPacket(client, ServerPacket.SET_PLAYER, client);
            }
        }
    }
    
} 