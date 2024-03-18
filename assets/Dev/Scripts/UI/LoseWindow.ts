import Window from "./Window";
import Button = cc.Button;
import GameController from "../GameController";
import ScoreTable from "./ScoreTable";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoseWindow extends Window {
    private readonly MAIN_CLICKED_EVENT: string = 'mainClicked';
    private readonly RESTART_CLICKED_EVENT: string = 'restartClicked';

    @property(Button)
    private main: Button = null;
    @property(Button)
    private restart: Button = null;

    @property(cc.AudioSource)
    private audioSource: cc.AudioSource = null;

    @property(ScoreTable)
    private scoreTable: ScoreTable = null;

    get isPopUp(): boolean {
        return false;
    }

    protected onLoad() {
        this.main.node.on(cc.Node.EventType.TOUCH_END, this.onHomeButtonClick, this);
        this.restart.node.on(cc.Node.EventType.TOUCH_END, this.onRestartButtonClick, this);
    }

    public show() {
        super.show();

        this.audioSource.play();
    }

    private onHomeButtonClick() {
        cc.systemEvent.emit(this.MAIN_CLICKED_EVENT);
    }

    private onRestartButtonClick() {
        cc.systemEvent.emit(this.RESTART_CLICKED_EVENT);
    }
}
