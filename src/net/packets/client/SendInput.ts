import "reflect-metadata";
import { TILESIZE } from "../../../Globals";
import Tilemap from "../../../world/maps/Tilemap";
import TilemapManager from "../../../world/maps/TilemapManager";
import Client from "../../Client";
import ClientPacket from "../../enums/ClientPacket";
import IPacketHandler from "../../interfaces/IPacketHandler";
import { ISocketPacket } from "../../interfaces/ISocketPacket";
import RequiredArguments from "../../RequiredArguments";

@Reflect.metadata(ClientPacket, ClientPacket.SEND_INPUT)
export default class SendInput implements IPacketHandler
{
    @RequiredArguments("x", "y", "mod")
    process = async(client: Client, packet?: ISocketPacket) => 
    {
        if(client.player.moving) return;

        const tilemap: Tilemap | undefined = TilemapManager.GetMap(client.player.map);

        if(packet && tilemap)
        {
            if(tilemap.tileAccessible(
                (client.player.position.x / TILESIZE)+Number.parseInt(packet.args.x),
                (client.player.position.y /TILESIZE)+Number.parseInt(packet.args.y)
            ))
            {

                client.player.lastInputDirection = {
                    x: Number.parseInt(packet.args.x)*(packet.args.mod ? 2 : 1),
                    y: Number.parseInt(packet.args.y)*(packet.args.mod ? 2 : 1)
                }
    
                client.player.position = {
                    x: client.player.position.x+client.player.lastInputDirection.x,
                    y: client.player.position.y+client.player.lastInputDirection.y
                }
            }
        }
    }
}