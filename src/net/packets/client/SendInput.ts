import "reflect-metadata";
import Tilemap from "../../../world/Tilemap";
import TilemapManager from "../../../world/TilemapManager";
import Client from "../../Client";
import ClientPacket from "../../enums/ClientPacket";
import IPacketHandler from "../../interfaces/IClientPacketHandler";
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
            client.player.lastInputDirection = {
                x: Number.parseInt(packet.args.x)*(packet.args.mod ? 2 : 1),
                y: Number.parseInt(packet.args.y)*(packet.args.mod ? 2 : 1)
            }
            
            client.player.position = {
                x: client.player.position.x+client.player.lastInputDirection.x,
                y: client.player.position.y+client.player.lastInputDirection.y
            }
        }
        /*
        let x = Number.parseInt(packet.args.x);
        if(x != 0)
        {
            x = client.position.x + (x < 0 ? (client.position.x > 0 ? -1 : 0) : x > 0 ? (client.position.x < tilemap.))
        }

        // create user session and register in user db
        */
    }
}