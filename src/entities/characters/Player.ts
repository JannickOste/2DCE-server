import { Character } from "./Character";
import UserData from "../UserData";
import Server from "../../net/Server";
import { IPosition } from "../IPosition";


export class Player extends Character
{
    public lastInputDirection: IPosition = {x: 0, y: 0}
    public static get Players(): Player[]
    {
        return Object.values(Server.Clients)
                     .filter(i => i !== null)
                     .map(i => (i?.player as Player));
    }

    private readonly _userData: UserData;
    public get userData() 
    {
        const data = this._userData;
        data.position = JSON.stringify(this.position);
        data.mapid = this.map;
        return data;
    }


    constructor(userData: UserData)
    {
        super(true);
        this._userData = userData;

        this.characterId = this._userData.mapid;
        this.position = JSON.parse(this._userData.position);
        this.map = this._userData.mapid;
    }

    Update(): void {
        if(this.moving)
        {
            this.position = {
                x: this.position.x + this.lastInputDirection.x, 
                y: this.position.y + this.lastInputDirection.y
            }
        }
    }
}