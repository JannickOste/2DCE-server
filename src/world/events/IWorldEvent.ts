import Client from "../../net/Client";

export default interface IWorldEvent 
{
    process: (client: Client, ...args: any[]) => void
}