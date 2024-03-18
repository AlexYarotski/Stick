const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    protected onLoad () {
        cc.director.getPhysicsManager().enabled = true;

        this.onBoxManager();
    }

    private onBoxManager(){
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;
    }
}