const { ccclass, property } = cc._decorator;

@ccclass
export default class TouchController extends cc.Component {
    private readonly TOUCHED_START : string = 'touchStart';
    private readonly TOUCHED_END : string = 'touchEnd';

    protected onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchStart() {
        if (this.checkTime()) cc.systemEvent.emit(this.TOUCHED_START);
    }

    private onTouchEnd() {
        if (this.checkTime()) cc.systemEvent.emit(this.TOUCHED_END);
    }

    private checkTime(): boolean{
        return cc.director.getScheduler().getTimeScale() !== 0
    }
}
