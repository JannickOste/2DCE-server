import { IPosition } from "../../../entities/IPosition";
import Client from "../../../net/Client";
import IWorldEvent from "../IWorldEvent";
import WorldEvent from "../WorldEvent";

@Reflect.metadata(WorldEvent, WorldEvent.SetPosition)
export default class SetPosition implements IWorldEvent 
{
    process: (client: Client, ...args: any[]) => void = (client: Client, position: IPosition) => {
        if(!client || !client.loggedIn) 
            throw new Error(`Attempting to invoke event for unregistered client => ${client.id}`);

        client.player.position = position;
    }
}