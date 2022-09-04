import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import MapLevel from "../world/MapLevel";

@Entity()
export default class UserData {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true})
    username!: string;

    @Column({default: JSON.stringify({x: 0, y: 0})})
    position!: string;
    
    @Column({unique: true})
    hash!: string;

    @Column({default: MapLevel.Littleroot})
    mapid!: number;
}