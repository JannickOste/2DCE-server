import "reflect-metadata";
import Client from "../../Client";
import ClientPacket from "../../enums/ClientPacket";
import ServerPacket from "../../enums/ServerPacket";
import IPacketHandler from "../../interfaces/IPacketHandler";
import PacketHandler from "../../PacketHandler";

@Reflect.metadata(ServerPacket, ServerPacket.SET_CLIENT_INFO)
export default class ServerHello implements IPacketHandler
{
    process = async(client: Client) => 
    {
        console.log("Sending server hello to client "+client.id)
        PacketHandler.SendPacket(client, {
            id: Reflect.getMetadata(ServerPacket, ServerHello),
            args: {
                pid: client.id
            }
        })
        
        // Construct client request map packet & invoke packet handler.
        PacketHandler.HandleClientPacket(client, {
            id: ClientPacket.REQUEST_MAP,
            args: {
                mapid: client.player.map
            }
        })
    }
}