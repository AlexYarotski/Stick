import Vec3 = cc.Vec3;
import BoxCollider = cc.BoxCollider;
import Vec2 = cc.Vec2;
import Size = cc.Size;
import ISurface from "./Interface/ISurface";
import Ground from "./Ground";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bridge extends cc.Component implements ISurface {
    private readonly DELTA_ANGLE: number = -90;

    private readonly HERO_GROUP: string = 'Hero';
    private readonly GROUND_NODE: string = 'Ground';
    private readonly DOUBLE_LINE_GROUP: string = 'DoubleLine';
    private readonly TOUCHED_START: string = 'touchStart';
    private readonly TOUCHED_END: string = 'touchEnd';
    private readonly DOUBLE_EVENT: string = 'double';
    private readonly COLLISION_ENTER: string = 'collision-enter';

    @property(Number)
    private durationRotate: number = 0.5;
    @property(Number)
    private growSpeed: number = 350;
    @property(Number)
    private sizeCollider: number = 10;

    @property(cc.BoxCollider)
    private checkCollider: cc.BoxCollider = null;

    @property(cc.AudioSource)
    private audioSource: cc.AudioSource = null;

    private boxCollider: BoxCollider = null;

    private hasBeenPutUp: boolean = false;
    private hasHeroCome: boolean = false;
    private isGrowing: boolean = false;
    //блокирует дабл нажатия и не дает взаимодействовать с объектом
    private isBlocked: boolean = false;

    private size: Size = new Size(0, 0);

    //запоминаем необходимые стартовые значения
    private initialRotation: number = 0;
    private initialPosition: Vec3 = new Vec3();
    private initialBoxColliderSize: Size = new Size(0, 0);
    private initialBoxColliderOffset: Vec2 = new Vec2();

    public get HasBeenPutUp(): boolean {
        return this.hasBeenPutUp;
    }
    public get HasHeroCome(): boolean {
        return this.hasHeroCome;
    }

    public set IsBlocked(value: boolean){
        this.isBlocked = value;
    }

    protected onEnable() {
        cc.systemEvent.on(this.TOUCHED_START, this.onTouchStart, this);
        cc.systemEvent.on(this.TOUCHED_END, this.onTouchEnd, this);
    }

    protected onDisable() {
        cc.systemEvent.off(this.TOUCHED_START, this.onTouchStart, this);
        cc.systemEvent.off(this.TOUCHED_END, this.onTouchEnd, this);
    }

    protected onLoad() {
        this.boxCollider = this.getComponent(BoxCollider);
        this.size = this.node.getContentSize();

        this.initialRotation = this.node.angle;
        this.initialPosition = this.node.position.clone();
        this.initialBoxColliderSize = this.boxCollider.size.clone();
        this.initialBoxColliderOffset = this.boxCollider.offset.clone();

        this.boxCollider.node.on(this.COLLISION_ENTER, this.onCollisionEnter, this);
        this.checkCollider.node.on(this.COLLISION_ENTER, this.onCollisionEnter, this);

        this.boxCollider.offset = new Vec2(this.size.width / 2, this.size.height / 2);
    }

    protected update(dt) {
        if (this.isGrowing && this.hasBeenPutUp === false) {
            this.node.height += this.growSpeed * dt;
            if (this.node.position) {
                this.size = this.node.getContentSize();
                this.boxCollider.offset = new Vec2(this.size.width / 2, this.size.height);
            }
        }
    }

    public reset() {
        this.node.width = 0;
        this.node.height = 0;
        this.node.angle = this.initialRotation;
        this.node.position = new Vec3(this.initialPosition);

        this.boxCollider.size = new Size(this.initialBoxColliderSize);
        this.boxCollider.offset.x = this.initialBoxColliderOffset.x;
        this.boxCollider.offset.y = this.initialBoxColliderOffset.y;

        this.checkCollider.size = new Size(this.initialBoxColliderSize);
        this.checkCollider.offset.x = this.initialBoxColliderOffset.x;
        this.checkCollider.offset.y = this.initialBoxColliderOffset.y;

        this.hasBeenPutUp = false;
        this.hasHeroCome = false;
        this.isGrowing = false;
    }

    public rotate(){
        let rotateAction = cc.tween().by(this.durationRotate, { angle: this.DELTA_ANGLE }, { easing: 'sineOut' });
        let onComplete = cc.callFunc(() => {
            this.hasBeenPutUp = true;
            this.boxCollider.size.width = this.sizeCollider;
            this.boxCollider.size.height = this.sizeCollider;

            const size = this.node.getContentSize();

            this.checkCollider.size = new Size(size.width, size.height);
            this.checkCollider.offset = new Vec2(size.width / 2, size.height / 2);
        }, this);

        let sequence = cc.tween().then(rotateAction).then(onComplete);

        cc.tween(this.node).then(sequence).start();
    }

    private onTouchStart() {
        if (this.isBlocked) return;

        this.node.width = 5;
        this.isGrowing = true;
    }

    private onTouchEnd() {
        if (this.hasBeenPutUp) return;

        this.isGrowing = false;

        this.rotate();
    }

    private onCollisionEnter(otherCollider: cc.Collider, selfCollider: cc.Collider) {
        if (this.isBlocked) return;

        if (otherCollider.node.getComponent(Ground)){
            this.audioSource.play();
        }

        let otherGroup = otherCollider.node.group;

        if (otherGroup === this.HERO_GROUP) {
            this.hasHeroCome = true;
        }else if(otherGroup === this.DOUBLE_LINE_GROUP){
            cc.systemEvent.emit(this.DOUBLE_EVENT)
            this.audioSource.play();
        }
    }
}
