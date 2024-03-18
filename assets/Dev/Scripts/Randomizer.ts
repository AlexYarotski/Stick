export default class Randomizer {
    public static getNumber(min: number, max: number, isInteger: boolean = true): number {
        if (isInteger) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        return Math.random() * (max - min) + min;
    }
}