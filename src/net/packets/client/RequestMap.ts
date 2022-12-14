import "reflect-metadata";
import { AppDataSource } from "../../../AppDataSource";
import UserData from "../../../entities/UserData";
import Client from "../../Client";
import ClientPacket from "../../enums/ClientPacket";
import IPacketHandler from "../../interfaces/IPacketHandler";
import { ISocketPacket } from "../../interfaces/ISocketPacket";
import { compareSync } from "bcrypt";
import ErrorCode from "../../../ErrorCode";
import RequiredArguments from "../../RequiredArguments";
import PacketHandler from "../../PacketHandler";
import TilemapManager from "../../../world/maps/TilemapManager";

@Reflect.metadata(ClientPacket, ClientPacket.REQUEST_MAP)
export default class Authenticate implements IPacketHandler
{
    
    @RequiredArguments("mapid")
    process = async(client: Client, packet?: ISocketPacket) => 
    {
        console.log(`Received authentication request from client #${client.id}`)
        
        const map = packet ? TilemapManager.GetMap(packet.args.mapid) : null;
        
        if(map)
            PacketHandler.SendPacket(client, map.toPacket());
        else client.Disconnect(ErrorCode.INVALID_PACKET);
    }
}