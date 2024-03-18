
export default class PooledBehaviour extends cc.Component {
    public get isFree(): boolean {
        return !this.node.active;
    }

    public free(): void {
        this.node.active = false;
    }

    public spawnedFromPool(): void {

    }
}