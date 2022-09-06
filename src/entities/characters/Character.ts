import { TILESIZE } from "../../Globals";
import GameEntity from "../GameEntity";

export abstract class Character extends GameEntity 
{
    characterId: number = 40;
    public get moving(){return this.position.x % TILESIZE != 0 || this.position.y % TILESIZE != 0}
    
    abstract Update(): void;
}