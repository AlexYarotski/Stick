//класс для запоминания счета
export default class ScoreManager {
    private static readonly SCORE_KEY: string = 'score';
    private static readonly BEST_SCORE_KEY: string = 'best_score';

    public static setScore(score: number): void {
        cc.sys.localStorage.setItem(this.SCORE_KEY, score.toString());
    }

    public static setBestScore(score: number): void {
        cc.sys.localStorage.setItem(this.BEST_SCORE_KEY, score.toString());
    }

    public static getScore(): number {
        const scoreString = cc.sys.localStorage.getItem(this.SCORE_KEY);
        return scoreString ? parseInt(scoreString) : 0;
    }

    public static getBestScore(): number {
        const scoreString = cc.sys.localStorage.getItem(this.BEST_SCORE_KEY);
        return scoreString ? parseInt(scoreString) : 0;
    }
}
