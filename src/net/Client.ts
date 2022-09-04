import * as ws from "ws";
import { IPosition } from "../entities/IPosition";
import PacketHandler from "./PacketHandler";
import ErrorCode from "../ErrorCode";
import UserData from "../entities/UserData";

export default class Client 
{
    private readonly _id: number;
    public get id(): number {
        return this._id; 
    }

    private readonly socket: ws.WebSocket;

    private _userData!: UserData;
    public get userData() { return this._userData; }
    public set userData(value: UserData) { if(!this._userData) this._userData = value; }

    public position: IPosition = { x: 0, y: 0 }
    public get connected() { 
        return this.socket.OPEN;
    }

    public get loggedIn(){
        return this.userData !== undefined;
    }

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
                console.log(e);
                this.socket.close();
            }
        });
    }

    Send        = (msg: string)    => this.socket.send(msg);
    Disconnect  = (errorCode: ErrorCode = ErrorCode.NONE) => this.socket.close();

    match = (socket: ws.WebSocket) => this.socket === socket;
}
