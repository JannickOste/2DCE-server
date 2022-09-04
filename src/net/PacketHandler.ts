import Client from "./Client";
import { ISocketPacket } from "./interfaces/ISocketPacket";
import {sync as globSync} from "glob";
import path from "path";
import ClientPacket from "./enums/ClientPacket";
import IPacketHandler from "./interfaces/IClientPacketHandler";
import ServerPacket from "./enums/ServerPacket";
import "reflect-metadata";
import RequiredArguments from "./RequiredArguments";
import ErrorCode from "../ErrorCode";



export default class PacketHandler 
{ 
    private static clientPacketHandlers: {[key: number]: IPacketHandler} = {}
    private static serverPacketHandlers: {[key: number]: IPacketHandler} = {}
    
    static async Init() 
    {
        for(let filepath of globSync("./**/*.ts", {realpath: true}).filter(i => i.includes(path.join(__dirname, "packets"))))
        {
            const module: any = (await import(filepath)).default;
            const clientPacketId: number | undefined = Reflect.getMetadata(ClientPacket, module);

            if(clientPacketId !== undefined) 
                this.clientPacketHandlers[clientPacketId] = new module();

            const serverPacketId: number | undefined = Reflect.getMetadata(ServerPacket, module);
            if(serverPacketId !== undefined) 
                this.serverPacketHandlers[serverPacketId] = new module();
        }
    }

    /**
     * Convert incomming packet buffer to utf-8 and attempt to parse to JSON object (ISocketPacket).
     */
    static async ParseIncommingPacket(client: Client, buffer: any)
    {
        // Convert bytes to utf-8 & parse using JSON to object.
        const packet = JSON.parse(Buffer.from(buffer).toString("utf-8"));

        await PacketHandler.HandleClientPacket(client, packet);
    }

    /**
     * Attempt to fetch handler based on the socket packet id and process packet if valid.
     * 
     * @param client 
     * @param packet 
     * @returns 
     */
    static HandleClientPacket = async(client: Client, packet: ISocketPacket) => 
    {
        const handler = this.clientPacketHandlers[packet.id];
        if(!handler)
        {
            console.log(`Received invalid packet from client #${client.id} => Packet #${packet.id}`);
            return client.Disconnect();
        }

        if(handler.process)
        {
            const requiredFields: string[] = Reflect.getMetadata(RequiredArguments.prototype.constructor.name, handler, "process");
            if(requiredFields === undefined || requiredFields.every(s => Object.keys(packet.args).includes(s)))
            {
                await handler.process(client, packet);
            } 
            else 
            {
                console.log(`Received packet with invalid arguments from client #${packet.id}`);
                client.Disconnect(ErrorCode.INVALID_PACKET);
            }
        }
        else 
        {
            console.log(`No processing function found on handler object for packet #${packet.id}`);
            delete(PacketHandler.clientPacketHandlers[packet.id]);
        }
    }

    /**
     * Send server packet to client.
     * 
     * @param client 
     * @param packet 
     */
    static SendPacket = (client: Client, packet: ISocketPacket) => 
    {
        client.Send(JSON.stringify(packet));
    }

}