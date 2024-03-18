import Label = cc.Label;
import ScoreManager from "../ScoreManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ScoreTable extends cc.Component {
    @property(Label)
    private currentScore: Label = null;

    @property(Label)
    private bestScore: Label = null;

    public show(){
        const currentScore = ScoreManager.getScore();
        const bestScore = ScoreManager.getBestScore();

        this.currentScore.string = currentScore.toString();

        if (currentScore > bestScore) {
            this.bestScore.string = currentScore.toString();
            ScoreManager.setBestScore(currentScore);
        }else {
            this.bestScore.string = bestScore.toString();
        }
    }
}
