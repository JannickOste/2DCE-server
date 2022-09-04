import { cp, Dirent } from "fs";
import path from "path";
import { MAPS_PATH } from "../Globals";
import MapLevel from "./MapLevel";
import Tilemap from "./Tilemap";

export default class TilemapManager
{
    private static tilemaps: {[id: number]:Tilemap } = {};
    
    public static async Init() 
    {
        const fs = require("fs");
        for(let fileInfoRoot of fs.readdirSync(MAPS_PATH, {withFileTypes: true}))
        {
            if(!(fileInfoRoot as Dirent).isDirectory() || !new RegExp(/^[0-9]+$/).test(fileInfoRoot.name.split(".")[0])) continue;
            
            const id = Number.parseInt(fileInfoRoot.name.split(".")[0]);
            if(MapLevel[id] === undefined) continue;

            const dirFiles = fs.readdirSync(path.join(MAPS_PATH, fileInfoRoot.name));
            if(["bg.csv", "fg.json"].every(s => dirFiles.includes(s)))
            {
                this.tilemaps[id] = new Tilemap(
                    fs.readFileSync(path.join(MAPS_PATH, fileInfoRoot.name, "bg.csv")),
                    JSON.parse(fs.readFileSync(path.join(MAPS_PATH, fileInfoRoot.name, "fg.json"))),
                    []
                )
            }
        }
    }

    public static GetMap(id: number): Tilemap | undefined
    {
        if(Object.keys(this.tilemaps).includes(`${id}`))
            return this.tilemaps[id];

    }
}