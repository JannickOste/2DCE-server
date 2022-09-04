import "reflect-metadata";
import Client from "../../Client";
import ClientPacket from "../../enums/ClientPacket";
import IPacketHandler from "../../interfaces/IClientPacketHandler";
import { ISocketPacket } from "../../interfaces/ISocketPacket";
import RequiredArguments from "../../RequiredArguments";

@Reflect.metadata(ClientPacket, ClientPacket.SEND_INPUT)
export default class SendInput implements IPacketHandler
{
    @RequiredArguments("x", "y")
    process = async(client: Client, packet: ISocketPacket) => 
    {
        client.position = {
            x: client.position.x+Number.parseInt(packet.args.x),
            y: client.position.y+Number.parseInt(packet.args.y)
        }

        // create user session and register in user db
    }
}