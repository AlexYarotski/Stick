import Window from "./Window";
import MainWindow from "./MainWindow";
import GameWindow from "./GameWindow";
import LoseWindow from "./LoseWindow";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WindowSwitcher extends cc.Component {
    @property(MainWindow)
    private mainWindow: MainWindow = null;
    @property(GameWindow)
    private gameWindow: GameWindow = null;
    @property(LoseWindow)
    private loseWindow: LoseWindow = null;

    private currentWindow: Window = null;
    private windowMap: Map<Function, Window> = new Map();

    protected onLoad() {
        this.hideWindowsInChild();
    }

    public show<T extends Window>(windowType: new () => T): void {
        const windowToShow = this.GetWindow(windowType);

        if (this.currentWindow && !windowToShow.isPopUp) {
            this.currentWindow.hide();
        }

        if (!windowToShow.isPopUp) {
            this.currentWindow = windowToShow;
        }

        windowToShow.show();
    }

    private GetWindow<T extends Window>(windowType: new () => T): T {
        const window = this.node.getChildByName(windowType.name);
        if (window) {
            return window.getComponent(windowType) as T;
        }
        throw new Error(`Window of type ${windowType.name} not found.`);
    }

    private hideWindowsInChild() {
        this.windowMap.set(MainWindow, this.mainWindow);
        this.windowMap.set(GameWindow, this.gameWindow);
        this.windowMap.set(LoseWindow, this.loseWindow);

        this.windowMap.forEach((window) => {
            if (window) {
                window.node.active = false;
            }
        });
    }
}
