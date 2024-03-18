const { ccclass, property } = cc._decorator;

export default abstract class Window extends cc.Component {
    public abstract get isPopUp(): boolean;

    public show(): void {
        this.node.active = true;
    }

    public hide(): void {
        this.node.active = false;
    }
}

