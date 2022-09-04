
import "reflect-metadata";
import { AppDataSource } from "./AppDataSource";
import UserData from "./entities/UserData";
import Server from "./net/Server";
import * as bcrypt from "bcrypt";
import ServerPacket from "./net/enums/ServerPacket";
import PacketHandler from "./net/PacketHandler";
import { compareSync } from "bcrypt";

(async() => {
    await AppDataSource.initialize();
    await PacketHandler.Init();

    console.log();
    const server: Server = new Server();

    server.Start();

    const dbu = await AppDataSource.getRepository(UserData).findOne({where:{username: "hello"}});
    if(dbu)
        AppDataSource.getRepository(UserData).delete(dbu);

    const u = new UserData();
    u.username = "hello";
    u.position = JSON.stringify({x: 0, y: 0})
    u.hash =  bcrypt.hashSync("hello world", 8)

    AppDataSource.getRepository(UserData).save(u);
})();