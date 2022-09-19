import MapLevel from "../world/maps/MapLevel";
import { IPosition } from "./IPosition";

export default abstract class GameEntity 
{
    map: MapLevel = MapLevel.Littleroot;
    position: IPosition = {x: 0, y: 0};

    private static _entities: GameEntity[] = [];
    public static get Entities()  { return this._entities; }

    constructor(excludeFromStack: boolean = false)
    {
        if(!excludeFromStack)
            GameEntity._entities.push()
    }

    abstract Update(): void;
    public Remove(entity: GameEntity) { GameEntity._entities = GameEntity._entities.filter(e => e !== entity)}

    
}