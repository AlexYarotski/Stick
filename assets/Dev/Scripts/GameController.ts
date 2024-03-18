import Hero from "./Hero";
import { GroundGenerator } from "./GroundGenerator";
import WindowSwitcher from "./UI/WindowSwitcher";
import MainWindow from "./UI/MainWindow";
import GameWindow from "./UI/GameWindow";
import LoseWindow from "./UI/LoseWindow";
import AudioManager from "./AudioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameController extends cc.Component {
    private readonly HERO_GROUP: string = 'Hero';
    private readonly LOSE_EVENT: string = 'Lose';
    private readonly MAIN_CLICKED_EVENT: string = 'mainClicked';
    private readonly RESTART_CLICKED_EVENT: string = 'restartClicked';
    private readonly START_GAME: string = 'startGame';
    private readonly COLLISION_ENTER: string = 'collision-enter';

    @property(cc.BoxCollider)
    private finalCollider: cc.BoxCollider = null;

    @property(Hero)
    private hero: Hero = null;
    @property(GroundGenerator)
    private groundGenerator: GroundGenerator = null;
    @property(WindowSwitcher)
    private windowSwitcher: WindowSwitcher = null;
    @property(AudioManager)
    private audioManager: AudioManager = null;

    @property(Number)
    private speedMove: number = 380;

    private canStop: boolean = false;

    protected onEnable() {
        cc.systemEvent.on(this.START_GAME, this.startGame, this);
        cc.systemEvent.on(this.LOSE_EVENT, this.lose, this)
        cc.systemEvent.on(this.MAIN_CLICKED_EVENT, this.main, this)
        cc.systemEvent.on(this.RESTART_CLICKED_EVENT, this.restart, this)
    }

    protected onDisable() {
        cc.systemEvent.off(this.START_GAME, this.startGame, this);
        cc.systemEvent.off(this.LOSE_EVENT, this.lose, this)
        cc.systemEvent.off(this.MAIN_CLICKED_EVENT, this.main, this)
        cc.systemEvent.off(this.RESTART_CLICKED_EVENT, this.restart, this)
    }

    protected onLoad() {
        this.finalCollider.node.on(this.COLLISION_ENTER, this.onCollisionEnter, this);
    }

    protected start() {
        this.windowSwitcher.show(MainWindow);
    }

    protected update(dt: number) {
        if ((this.canStop === false || !this.hero.IsBlocked) && this.hero.CanGo === false && this.hero.CanFall === false) {
            this.moveNode(dt, this.hero.node);
            this.moveNode(dt, this.hero.Bridge.node);
            this.moveNode(dt, this.groundGenerator.BusyGroundArray[0].node);
            this.moveNode(dt, this.groundGenerator.BusyGroundArray[1].node);
        }
    }

    private onCollisionEnter(otherCollider: cc.Collider, selfCollider: cc.Collider) {
        let objectGroup = otherCollider.node.group;

        if (objectGroup === this.HERO_GROUP) {
            this.canStop = true;
            this.hero.reset();

            this.groundGenerator.disableGround();
            this.groundGenerator.moveNewGround();
        }

        this.canStop = false;
    }

    private moveNode(dt: number, node: cc.Node) {
        let newPosX = node.position.x - this.speedMove * dt;
        node.setPosition(newPosX, node.position.y);
    }

    private startGame() {
        this.windowSwitcher.show(GameWindow);

        //проверяем в первый ли раз открываем GameWindow
        if (!this.hero.IsBlocked){
            this.groundGenerator.moveNewGround();
            this.canStop = false;
        }
    }

    private lose() {
        this.windowSwitcher.show(LoseWindow);

        this.canStop = true;
    }

    private main() {
        this.windowSwitcher.show(MainWindow);
        this.canStop = true;
        this.hero.setStartPosition();
    }

    private restart(){
        this.windowSwitcher.show(GameWindow);

        this.canStop = true;
        this.hero.setStartPosition();
    }
}
