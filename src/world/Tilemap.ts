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
    private rows: number = 0;
    private columns: number = 0;

    public get Rows(): number{
        return this.rows;
    }
    public get Columns(): number {
        return this.columns;
    }

    constructor(bg: string, fg: ITile[], collider: ITile[]) 
    {
        this.bg = Buffer.from(bg).toString("utf-8");
        this.fg = fg;
        this.collider = collider;
        this.rows = this.bg.split("\n").length;
        this.columns = this.bg.split("\n")[0].split(";").length;
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
