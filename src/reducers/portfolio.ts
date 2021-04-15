import { PortfolioAPITypeKeys, PortfolioAPITypes } from '../actions/portfolio';
import { Boxes } from '../types/Portfolio';

export interface IInitialState {
    boxes: Boxes;
}

const initialState: IInitialState = {
    boxes: {},
};

export default function portfolio(
    state: IInitialState = initialState,
    action: PortfolioAPITypes
) {
    switch (action.type) {
        case PortfolioAPITypeKeys.UPDATE_BOXES:
            return {
                boxes: action.boxes,
            };
        default:
            return state;
    }
}
