import PoolConfig from "./PoolConfig";
import PooledType from "./PooledType";
import PooledBehaviour from "./PooledBehaviour";
import Vec3 = cc.Vec3;

const { ccclass, property } = cc._decorator;

@ccclass
export default class PoolManager extends cc.Component {
    private pooledMap: Map<PooledType, PooledBehaviour[]> = new Map<PooledType, PooledBehaviour[]>();

    @property({
        type: [PoolConfig],
        serializable: true
    })
    poolConfigs: PoolConfig[] = [];

    protected onLoad() {
        this.preparePoolDictionary();
    }

    public getObject<T extends PooledBehaviour>(pooledType: PooledType, position: Vec3): T | null {
        const poolBehaviour = this.pooledMap.get(pooledType);
        if (!poolBehaviour) {
            cc.log("There is no such type!");
            return null;
        }

        let freePoolObj: PooledBehaviour | null = null;
        for (const obj of poolBehaviour) {
            if (!obj.node.activeInHierarchy) {
                freePoolObj = obj;
                break;
            }
        }

        if (!freePoolObj) {
            freePoolObj = this.addItemToPoolMap(poolBehaviour, pooledType);
            if (freePoolObj) {
                poolBehaviour.push(freePoolObj);
            }
        }

        if (freePoolObj) {
            freePoolObj.node.setPosition(position);
            freePoolObj.node.active = true;
        }

        return this.preparationPoolObjBeforeDelivery(freePoolObj, position) as T;
    }

    private addItemToPoolMap(poolBehaviour: PooledBehaviour[], pooledType: PooledType): PooledBehaviour | null {
        const typePoolConfig = this.poolConfigs.find(pt => pt.PoolType === pooledType);
        if (!typePoolConfig) {
            cc.log("Нет такой конфигурации!");
            return null;
        }

        const createObject = cc.instantiate(typePoolConfig.PooledPrefab);
        poolBehaviour.push(createObject.getComponent(PooledBehaviour));
        return createObject.getComponent(PooledBehaviour);
    }

    private preparePoolDictionary() {
        for (const poolConfig of this.poolConfigs) {
            const poolList = this.createPoolObjects(poolConfig);
            if (this.pooledMap.has(poolConfig.PoolType)) {
                this.pooledMap.get(poolConfig.PoolType)!.push(...poolList);
            } else {
                this.pooledMap.set(poolConfig.PoolType, poolList);
            }
        }
    }

    private createPoolObjects(poolConfig: PoolConfig): PooledBehaviour[] {
        const poolList: PooledBehaviour[] = [];
        for (let i = 0; i < poolConfig.Count; i++) {
            const poolObject = cc.instantiate(poolConfig.PooledPrefab);
            poolObject.getComponent(PooledBehaviour).free();
            poolList.push(poolObject.getComponent(PooledBehaviour));
        }
        return poolList;
    }

    private preparationPoolObjBeforeDelivery<T extends PooledBehaviour>(poolObj: PooledBehaviour, position: Vec3): T {
        poolObj.spawnedFromPool();
        poolObj.node.position = position;
        poolObj.node.active = true;
        return poolObj as T;
    }
}