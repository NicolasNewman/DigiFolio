/* eslint-disable no-underscore-dangle */
export default abstract class IAPI<DM> {
    private _data: DM | null = null;

    private opt: RequestInit;

    /**
     * @param _name - the name of the integrated service
     * @param _key - the API key used to access the service
     */
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

    /**
     * Wrapper around JS' build-in fetch function with the following features:
     * 1) Handles the stringifying and json conversion automatically
     * 2) Handles the selection of the headers automatically
     * @param url - the url of the route to request to
     * @param body - the data to be given through the request
     */
    async fetch(url, body): Promise<unknown> {
        this.opt.body = JSON.stringify(body);
        const res = await fetch(url, this.opt);
        this.opt.body = '';
        return res.json();
    }

    abstract parse_api(): Promise<DM>;
}
