/* eslint-disable no-underscore-dangle */
export default abstract class IAPI<DM> {
    private _data: DM | null = null;

    constructor(private _name, private _key) {}

    get name(): string {
        return this._name;
    }

    set data(data: DM | null) {
        this._data = data;
    }

    get data(): DM | null {
        return this._data;
    }

    abstract fetch(): Promise<DM>;
}
