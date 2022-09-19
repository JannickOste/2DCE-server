import path from "path";
import IWorldEvent from "./IWorldEvent";
import WorldEvent from "./WorldEvent";

export default class WorldEventManager 
{
    private static readonly events: {[key: number]: IWorldEvent} = {}
    public static async Init() 
    {
        const fs = require("fs");
        const root = path.join(__dirname, "triggers");

        for(let dirent of fs.readdirSync(root, {withFileTypes: true}))
        {
            if(dirent.isFile() && dirent.name.endsWith(".ts"))
            {
                const module = await import(path.join(root, dirent.name));
                const metaKey = Reflect.getMetadata(WorldEvent, module.default);
                if(metaKey !== undefined)
                    this.events[metaKey] = new module.default();
            }
        }

    }

    public static GetEventHandler = (eventId: WorldEvent) => this.events[eventId]?.process;
}