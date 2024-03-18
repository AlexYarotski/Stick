import Bridge from "./Bridge";
import ISurface from "./Interface/ISurface";
import Vec3 = cc.Vec3;

const {ccclass, property} = cc._decorator;

@ccclass
export default class Hero extends cc.Component {
    private readonly WALLS_GROUP: string = 'Walls';
    private readonly BRIDGE_GROUP: string = 'Bridge';
    private readonly STOP_LINE_GROUP: string = 'StopLine';
    private readonly LOSE_LINE_GROUP: string = 'LoseLine';
    private readonly COLLISION_ENTER: string = 'collision-enter';
    private readonly COLLISION_EXIT: string = 'collision-exit';
    private readonly GAME_EVENT: string = 'cameHero';
    private readonly LOSE_EVENT: string = 'Lose';

    private readonly OFFSET_START_POS_X = 80;
    private readonly MIN_COUNT_GROUND: number = 2;

    @property(Number)
    private speedMove: number = 250;
    @property(Number)
    private speedFalling: number = 3000;
    @property(Number)
    private restartDelay: number = 0.5;

    @property(cc.AudioSource)
    private audioSource: cc.AudioSource = null;
    @property(Bridge)
    private bridge: Bridge = null;

    private canGo: boolean = false;
    private canFall: boolean = false;
    private hasCome: boolean = false;
    //блокирует дабл нажатия и не дает взаимодействовать с объектом
    private isBlocked: boolean = false;

    private surfaceObjects: ISurface[] = [];

    private animation: cc.Animation = null;
    private boxCollider: cc.BoxCollider = null;

    private countGround: number = 0;
    private startPos: Vec3 = new Vec3();

    public get CanGo(): boolean {
        return this.canGo;
    }

    public get CanFall(): boolean {
        return this.canFall;
    }

    public get Bridge(): Bridge {
        return this.bridge;
    }

    public get IsBlocked(): boolean{
        return this.isBlocked;
    }
    public set IsBlocked(value: boolean){
        this.isBlocked = value;
    }

    protected onLoad() {
        this.startPos = this.node.position;

        this.animation = this.getComponent(cc.Animation);
        this.boxCollider = this.getComponent(cc.BoxCollider);

        this.boxCollider.node.on(this.COLLISION_ENTER, this.onCollisionEnter, this);
        this.boxCollider.node.on(this.COLLISION_EXIT, this.onCollisionExit, this);
    }

    protected start() {
        this.animation.enabled = false;
        this.canGo = true;
    }

    protected update(dt: number) {
        if (this.isBlocked) return;

        if (this.bridge.HasBeenPutUp && this.canGo) {
            this.moveRight(dt);
        } else if (this.canFall) {
            this.falling(dt);
        }
    }

    public reset() {
        this.canGo = true;
        this.canFall = false;
        this.hasCome = false;
        this.countGround = 0;

        this.bridge.reset();
    }

    public setStartPosition() {
        this.animation.enabled = true;

        cc.tween(this.node)
            .to(this.restartDelay, {position: this.startPos})
            .call(() => {
                this.animation.enabled = false;

                this.setActiveCollider(true);
                this.reset();

                this.isBlocked = false;
                this.bridge.IsBlocked = false;
            })
            .start();
    }

    private onCollisionEnter(otherCollider: cc.Collider, selfCollider: cc.Collider) {
        let group = otherCollider.node.group;

        if (this.isBlocked) return;

        if (group === this.WALLS_GROUP || group === this.BRIDGE_GROUP) {
            //проверяем можно ли добавить объект в surfaceObjects
            if (!this.hasCome && !this.surfaceObjects.includes(otherCollider.node)) {
                this.surfaceObjects.push(otherCollider.node);
                this.countGround++;

                this.canGo = true;
            }
        } else if (group === this.STOP_LINE_GROUP) {
            //проверяем нужно ли нам остановиться
            if (this.bridge.HasHeroCome && this.countGround > this.MIN_COUNT_GROUND) {
                this.surfaceObjects.splice(0, this.surfaceObjects.length);
                this.hasCome = true;
                this.canFall = false;
                this.audioSource.play();
                this.stopMove();
                cc.systemEvent.emit(this.GAME_EVENT);
            }
        } else if (group === this.LOSE_LINE_GROUP) {
            cc.systemEvent.emit(this.LOSE_EVENT);

            this.bridge.IsBlocked = true;
            this.bridge.rotate();
        }
    }

    private onCollisionExit(otherCollider: cc.Collider, selfCollider: cc.Collider) {
        let group = otherCollider.node.group;

        if (this.isBlocked) return;

        if ((group === this.WALLS_GROUP || group === this.BRIDGE_GROUP) && !this.hasCome) {
            let index = this.surfaceObjects.indexOf(otherCollider.node);

            if (index !== -1) {
                this.surfaceObjects.splice(index, 1);
                //проверяем проиграли ли мы
                if (this.bridge.HasHeroCome && this.surfaceObjects.length === 0) {
                    this.stopMove();
                    this.canFall = true;
                }
            }
        } else if (group === this.LOSE_LINE_GROUP) {
            this.isBlocked = true;
            this.canFall = false;
            this.node.position = new Vec3(this.startPos.x - this.OFFSET_START_POS_X, this.startPos.y);
            this.setActiveCollider(false);
        }
    }

    private moveRight(dt: number) {
        if (!this.animation.enabled) {
            this.animation.enabled = true;
        }

        let currentPosition = this.node.position;
        let newPosX = currentPosition.x + this.speedMove * dt;

        this.node.setPosition(newPosX, currentPosition.y);
    }

    private falling(dt: number) {
        let currentPosition = this.node.position;
        let newPosY = currentPosition.y - this.speedFalling * dt;

        this.node.setPosition(currentPosition.x, newPosY);
    }

    private stopMove() {
        if (this.isBlocked) return;

        this.animation.enabled = false;
        this.canGo = false;
    }

    private setActiveCollider(active: boolean) {
        let colliderComponents = this.node.getComponents(cc.BoxCollider);

        for (let i = 0; i < colliderComponents.length; i++) {
            colliderComponents[i].enabled = active;
        }
    }
}