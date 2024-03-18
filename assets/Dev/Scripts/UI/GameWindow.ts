import Window from "./Window";
import Label = cc.Label;
import ScoreManager from "../ScoreManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameWindow extends Window {
    private readonly START_GAME: string = 'startGame';
    private readonly CAME_EVENT: string = 'cameHero';
    private readonly DOUBLE_EVENT: string = 'double';

    @property(Label)
    private counter: Label = null;

    @property(Number)
    private scaleDuration: number = 0.5;
    @property(Number)
    private increase: number = 1.5;

    private originalScale: number = 0;
    private count: number = 0;

    get isPopUp(): boolean {
        return false;
    }

    protected onEnable() {
        cc.systemEvent.on(this.START_GAME, this.resetCounter, this);
        cc.systemEvent.on(this.CAME_EVENT, this.increaseScore, this);
        cc.systemEvent.on(this.DOUBLE_EVENT, this.increaseScore, this);
    }

    protected onDisable() {
        cc.systemEvent.off(this.START_GAME, this.resetCounter, this);
        cc.systemEvent.off(this.CAME_EVENT, this.increaseScore, this);
        cc.systemEvent.off(this.DOUBLE_EVENT, this.increaseScore, this);
    }

    protected start() {
        this.originalScale = this.counter.node.scale;
    }

    public show() {
        super.show();

        this.resetCounter();
    }

    public hide() {
        super.hide();

        ScoreManager.setScore(this.count);
    }

    public resetCounter(){
        this.count = 0;
        this.counter.string = this.count.toString();
    }

    private increaseScore(){
        this.count++;
        this.counter.string = this.count.toString();

        cc.Tween.stopAllByTarget(this.counter.node);

        cc.tween(this.counter.node)
            .to(this.scaleDuration, { scale: this.originalScale * this.increase })
            .call(() => {
                cc.tween(this.counter.node)
                    .to(this.scaleDuration, { scale: this.originalScale })
                    .start();
            })
            .start();
    }
}
