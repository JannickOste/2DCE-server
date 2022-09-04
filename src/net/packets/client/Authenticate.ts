import "reflect-metadata";
import { AppDataSource } from "../../../AppDataSource";
import UserData from "../../../entities/UserData";
import Client from "../../Client";
import ClientPacket from "../../enums/ClientPacket";
import IPacketHandler from "../../interfaces/IClientPacketHandler";
import { ISocketPacket } from "../../interfaces/ISocketPacket";
import { compareSync } from "bcrypt";
import ErrorCode from "../../../ErrorCode";
import RequiredArguments from "../../RequiredArguments";

@Reflect.metadata(ClientPacket, ClientPacket.AUTHENTICATE)
export default class Authenticate implements IPacketHandler
{
    private async Verify(username: string, password: string): Promise<UserData | null>
    {
        const data = await AppDataSource.getRepository(UserData).findOne({where:{username: username}});
        if(data && compareSync(password, data.hash))
            return data;
        
        return null;
    }

    @RequiredArguments("username", "password")
    process = async(client: Client, packet: ISocketPacket) => 
    {
        console.log(`Received authentication request from client #${client.id}`)
 
        const userData: UserData | null = await this.Verify(packet.args.username, packet.args.password);
        if(!userData)
        {
            console.log("Invalid credentials, revoking connection request");
            return client.Disconnect(ErrorCode.INVALID_CREDENTIALS);
        }

        client.userData = userData;
        
        // create user session and register in user db

    }
}