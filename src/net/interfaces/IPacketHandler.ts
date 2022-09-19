import Client from "../Client";
import { ISocketPacket } from "./ISocketPacket"

interface IPacketHandler
{
    process: (client: Client, packet?: ISocketPacket, ...args: any[]) => Promise<void>;
}

export const isIPacketHandler = (obj: any) =>
{
    return (obj && obj.process !== undefined)
}

export default IPacketHandler;