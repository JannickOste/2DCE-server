import * as ws from "ws";
import PacketHandler from "./PacketHandler";
import ErrorCode from "../ErrorCode";
import { Player } from "../entities/characters/Player";
import { AppDataSource } from "../AppDataSource";
import UserData from "../entities/UserData";


export default class Client 
{
    private readonly _id: number;
    public get id(): number { return this._id;  }
    
    private _player!: Player;
    public get player() { return this._player; }
    public set player(value: Player) { if(!this.player) this._player = value; }
    
    private readonly socket: ws.WebSocket;
    // Will be all transfered to player class, just converting in case of push

    public get connected() {  return this.socket.OPEN; }
    public get loggedIn(){  return this.player !== undefined; }

    constructor(id: number, socket: ws.WebSocket)
    {
        this._id = id;
        this.socket = socket;

        socket.on("message", async(msg: any) => {
            try
            {
                await PacketHandler.ParseIncommingPacket(this, msg);
            }
            catch(e)
            {
                this.socket.close();
            }
        });
    }

    Send        = (msg: string)    => this.socket.send(msg);
    Disconnect  = (errorCode: ErrorCode = ErrorCode.NONE) => this.socket.close();
    Save        = async() => {
        const userData = this.player?.userData;

        if(userData)
            await AppDataSource.getRepository(UserData).update(userData.id, userData);
        else console.log(`Failed to update userdata for Client #${this.id}::${this.player?.userData.username}`);
    } 

    match = (socket: ws.WebSocket) => this.socket === socket;
}
