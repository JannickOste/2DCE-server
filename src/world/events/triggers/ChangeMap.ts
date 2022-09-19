import Client from "../../../net/Client";
import ClientPacket from "../../../net/enums/ClientPacket";
import ServerPacket from "../../../net/enums/ServerPacket";
import PacketHandler from "../../../net/PacketHandler";
import MapLevel from "../../maps/MapLevel";
import IWorldEvent from "../IWorldEvent";
import WorldEvent from "../WorldEvent";

@Reflect.metadata(WorldEvent, WorldEvent.ChangeMap)
export default class ChangeMap implements IWorldEvent 
{
    process: (client: Client, ...args: any[]) => void = (client: Client, mapId: MapLevel) => PacketHandler.HandleClientPacket(client, {
        id: ClientPacket.REQUEST_MAP,
        args: {
            mapId: mapId
        }
    })
}