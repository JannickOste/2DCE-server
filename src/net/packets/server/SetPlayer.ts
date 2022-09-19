import "reflect-metadata";
import Client from "../../Client";
import ServerPacket from "../../enums/ServerPacket";
import IPacketHandler from "../../interfaces/IPacketHandler";
import PacketHandler from "../../PacketHandler";

@Reflect.metadata(ServerPacket, ServerPacket.SET_PLAYER)
export default class SetPlayer implements IPacketHandler
{
    process = async(client: Client, packet: any, ...args: Client[]) => 
    {
        for(let p of args)
            PacketHandler.SendPacket(client, {
                id: ServerPacket.SET_PLAYER,
                args: {
                    pid: client.id,
                    x: client.player.position.x,
                    y: client.player.position.y
                }
            })
    }
}