/* eslint-disable no-underscore-dangle */
export default abstract class IAPI<DM> {
    private _data: DM | null = null;

    private opt: RequestInit;

    constructor(private _name: string, private _key: string) {
        this.opt = {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': _key,
            },
        };
    }

    get name(): string {
        return this._name;
    }

    set data(data: DM | null) {
        this._data = data;
    }

    get data(): DM | null {
        return this._data;
    }

    async fetch(url, body): Promise<unknown> {
        this.opt.body = JSON.stringify(body);
        const res = await fetch(url, this.opt);
        this.opt.body = '';
        return res.json();
    }

    abstract parse_api(): Promise<DM>;
}
