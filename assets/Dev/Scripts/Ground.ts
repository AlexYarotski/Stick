import ISurface from "./Interface/ISurface";
import PooledBehaviour from "./PoolSystem/PooledBehaviour";
import PooledType from "./PoolSystem/PooledType";
import pooledType from "./PoolSystem/PooledType";
import Double from "./Double";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ground extends cc.Component implements ISurface{
    public get IsFree(): boolean {
        return !this.enabled;
    }
}
