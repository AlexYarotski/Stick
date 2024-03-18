import Window from "./Window";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainWindow extends Window {
    private readonly START_GAME: string = 'startGame';

    @property(cc.Button)
    private startButton: cc.Button = null;

    get isPopUp(): boolean {
        return false;
    }

   protected onLoad() {
        this.startButton.node.on(cc.Node.EventType.TOUCH_END, this.handleClick, this);
    }

    public show() {
        super.show();

        cc.director.getScheduler().setTimeScale(0);
    }

    public hide() {
        super.hide();

        cc.director.getScheduler().setTimeScale(1);
    }

    private handleClick() {
        cc.systemEvent.emit(this.START_GAME);

        this.hide();
    }
}
