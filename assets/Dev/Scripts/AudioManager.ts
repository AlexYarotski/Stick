import Button = cc.Button;
import AudioSource = cc.AudioSource;
import Sprite = cc.Sprite;

const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioManager extends cc.Component {

    @property({ type: Button })
    private button: Button = null;

    @property({ type: AudioSource })
    private background: AudioSource = null;

    @property({
        type: [AudioSource]
    })
    audioSources: AudioSource[] = [];

    @property({ type: Sprite })
    private enabledSprite: Sprite = null;

    @property({ type: Sprite })
    private disabledSprite: Sprite = null;

    private readonly CLICK = 'click';
    private soundButton: Button = null;
    private isOff = false;

    protected start() {
        this.soundButton = this.button;
        if (!this.soundButton){
            console.error(`Button ${this.button} is not a Button component!`);
            return;
        }

        this.enabledSprite.enabled = true;
        this.disabledSprite.enabled = false;

        this.soundButton.node.on(this.CLICK, this.setToggle, this);
    }
//#region Sound
    public play(){
        this.background.volume = 0.5;
        cc.log(`play ${this.background.volume}`)
        this.setActive(true);
    }

    public stop(){
        cc.log(`stop ${this.background.volume}`)
        this.background.volume = 0;
        this.setActive(false);
    }
    //#endregion

    //#region Toggle
    private setActive(active: boolean){
        for (let i = 0; i < this.audioSources.length; i++) {
            active ? this.audioSources[i].volume = 1 : this.audioSources[i].volume = 0;
        }
    }

    private setToggle(){
        this.isOff = !this.isOff;
        this.toggleSound(this.isOff);
    }

    private toggleSound(active: boolean) {
        if (active === false){
            this.enabledSprite.enabled = false;
            this.disabledSprite.enabled = true;
            this.stop();
        } else{
            this.enabledSprite.enabled = true;
            this.disabledSprite.enabled = false;
            this.play();
        }
    }
    //#endregion
}
