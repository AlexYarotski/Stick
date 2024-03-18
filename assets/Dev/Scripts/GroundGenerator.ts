import Randomizer from "./Randomizer";
import Ground from "./Ground";

const {ccclass, property} = cc._decorator;

@ccclass
export class GroundGenerator extends cc.Component {
    private readonly MIN_X: number = 100;
    private readonly MAX_X: number = 450;

    @property(Number)
    private durationMovement: number = 0.7;

    @property(Ground)
    private firstPrefab: Ground = null;

    private groundArray: Ground[] = [];

    private busyGroundArray: Ground[] = [];

    public get BusyGroundArray(): Ground[] {
        return this.busyGroundArray;
    }

    protected onLoad() {
        this.setGroundArray();

        this.firstPrefab.node.x = -this.node.position.x;
        this.busyGroundArray.push(this.firstPrefab);
    }

    public moveNewGround(){
        if (this.busyGroundArray.length > 1) return;

        let index = this.getFreeGround();
        let posX =  -this.node.position.x +this.getPositionX();

        this.busyGroundArray.push(this.groundArray[index]);
        let lastIndex =  this.busyGroundArray.length - 1;

        this.busyGroundArray[lastIndex].enabled = true;

        cc.tween(this.busyGroundArray[lastIndex].node)
            .to(this.durationMovement,
                { position: cc.v3(posX, this.busyGroundArray[lastIndex].node.y,
                        this.busyGroundArray[lastIndex].node.z) })
            .start();

        let occupiedCount: number = 0;

        for (let i = 0; i < this.groundArray.length; i++) {
            if (!this.groundArray[i].IsFree) {
                occupiedCount++;
            }
        }
    }

    public disableGround() {
        this.busyGroundArray[0].enabled = false;
        this.busyGroundArray[0].node.setPosition(0, this.busyGroundArray[0].node.y);

        this.busyGroundArray.shift();
    }

    private getPositionX(): number{
        return Randomizer.getNumber(this.MIN_X, this.MAX_X, false);
    }

    private getFreeGround(): number {
        let freeIndexes: number[] = [];

        for (let i = 0; i < this.groundArray.length; i++) {
            if (this.groundArray[i].IsFree && !this.busyGroundArray.includes(this.groundArray[i])) {
                freeIndexes.push(i);
            }
        }

        if (freeIndexes.length === 0) {
            return -1;
        }

        let randomIndex = Math.floor(Math.random() * freeIndexes.length);
        return freeIndexes[randomIndex];
    }

    private setGroundArray(){
        this.groundArray = this.node.getComponentsInChildren(Ground);

        for (let i = 0; i < this.groundArray.length; i++) {
            this.groundArray[i].enabled = false;
        }
    }
}