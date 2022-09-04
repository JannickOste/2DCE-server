import ServerPacket from "../net/enums/ServerPacket";

interface ITile 
{
    x: number,
    y: number,
    id: number
}
export default class Tilemap 
{
    private bg: string = "";
    private fg: ITile[] = [];
    private collider: ITile[] = [];

    constructor(bg: string, fg: ITile[], collider: ITile[]) 
    {
        console.dir(fg);
        this.bg = Buffer.from(bg).toString("utf-8");
        this.fg = fg;
        this.collider = collider;
    }

    toPacket()
    {
        return {
            id: ServerPacket.MAP_RESPONSE,
            args: {
                bg: this.bg,
                fg: this.fg
            }
        }
    }
}
