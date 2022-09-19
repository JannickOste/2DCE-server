import { Dirent } from "fs";
import path from "path";
import { MAPS_PATH } from "../../Globals";
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
            if(["tilemap.json"].every(s => dirFiles.includes(s)))
            {
                const tilemapData = JSON.parse(fs.readFileSync(path.join(MAPS_PATH, fileInfoRoot.name, "tilemap.json")))
                this.tilemaps[id] = new Tilemap(
                    tilemapData["bg"],
                    tilemapData["fgLayers"],
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