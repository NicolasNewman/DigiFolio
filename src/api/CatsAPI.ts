/* eslint-disable class-methods-use-this */
import IAPI from './IAPI';

export interface CatsAPIDataModel {
    info: string;
    voteData: any;
    favoriteData: any;
}

export type CatsAPIData = CatsAPIDataModel | null;

export default class CatsAPI extends IAPI<CatsAPIDataModel> {
    private username: string;

    constructor(key: string, username: string) {
        super(key);
        this.username = username;
    }

    async parse_api(): Promise<CatsAPIDataModel> {
        const temp: CatsAPIDataModel = {
            info: 'Test',
            voteData: await this.process_votes(),
            favoriteData: await this.get_favourite_breeds(),
        };
        console.log(temp);
        return temp;
    }

    async process_votes() {
        const votes = await this.fetch('https://api.thecatapi.com/v1/votes', {
            sub_id: this.username,
        });
        return votes;
    }

    async get_favourite_breeds() {
        const favourites = await this.fetch(
            'https://api.thecatapi.com/v1/favourites',
            {
                sub_id: this.username,
            }
        );
        return favourites;
    }

    // async get_specific_favourite(fav_id) {
    //     const requestedFavourite = await fetch(
    //         `https://api.thecatapi.com/v1/favourites/${fav_id}`,
    //         {
    //             method: 'GET',
    //         }
    //     );
    //     return requestedFavourite;
    // }

    // async get_all_images(lim = 10) {
    //     const url = `https://api.thecatapi.com/v1/images/search?limit=${lim}`;
    //     const images = await fetch(url, {
    //         method: 'GET',
    //     });
    //     return images;
    // }
}
