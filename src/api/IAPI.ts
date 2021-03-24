/**
 * Abstract class for a services integration
 * @param DM - generic interface for the format of the processed data
 */
export default abstract class IAPI<DM> {
    /** the variable storing the processed data */
    private _data: DM | null = null;

    /** The options containing the header information for the request */
    private opt: RequestInit;

    /**
     * @param _name - the name of the integrated service
     * @param _key - the API key used to access the service
     */
    constructor(private headers: HeadersInit) {
        this.opt = {
            method: 'GET',
            mode: 'cors',
            headers,
        };
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
    async fetch<T>(url, body?: { [key: string]: any }): Promise<T> {
        console.log(url, this.opt);
        let newURL = url;
        if (body) {
            newURL = '';
            Object.keys(body).forEach((key) => {
                newURL = `${url}?${key}=${body[key]}`;
            });
            console.log(newURL);
        }
        const res = await fetch(newURL, this.opt);
        return res.json();
    }

    abstract parse_api(): Promise<DM>;
}
