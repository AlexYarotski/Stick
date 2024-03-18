import PooledType from "./PooledType";
import PooledBehaviour from "./PooledBehaviour";
import Prefab = cc.Prefab;

const { ccclass, property } = cc._decorator;

@ccclass
export default class PoolConfig extends cc.Component {
    @property(Number)
    private count: number = 0;

    @property(PooledType)
    private poolType: PooledType = PooledType.Ground; // Используйте poolType вместо pooledType

    @property(Prefab)
    private pooledPrefab: Prefab = null;

    public get Count(): number {
        return this.count;
    }

    public get PoolType(): PooledType { // Используйте PoolType вместо pooledType
        return this.poolType;
    }

    public get PooledPrefab(): Prefab {
        return this.pooledPrefab;
    }
}