import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export default class UserData {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true})
    username!: string;

    @Column()
    position!: string;
    
    @Column()
    hash!: string;
}