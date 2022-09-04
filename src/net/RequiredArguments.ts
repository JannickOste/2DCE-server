export default function RequiredArguments(...keys: string[])
{
    return Reflect.metadata(RequiredArguments.prototype.constructor.name, keys);
}