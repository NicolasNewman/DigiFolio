/* eslint-disable import/no-cycle */
import { WidgetComponentType } from '../components/widgets/IWidget';
import { IInitialState } from '../reducers/portfolio';
import { Boxes } from '../types/Portfolio';

export enum PortfolioAPITypeKeys {
    UPDATE_BOXES = 'UPDATE_BOXES',
    RESTORE = 'RESTORE',
}

interface UpdateBoxesAction {
    type: PortfolioAPITypeKeys.UPDATE_BOXES;
    boxes: Boxes;
}

interface RestoreAction {
    type: PortfolioAPITypeKeys.RESTORE;
    state: IInitialState;
}

export type PortfolioAPITypes = UpdateBoxesAction | RestoreAction;

export function updatePortfolioBoxes(boxes: Boxes) {
    return {
        type: PortfolioAPITypeKeys.UPDATE_BOXES,
        boxes,
    };
}

export function restorePortfolio(state: IInitialState) {
    return { type: PortfolioAPITypeKeys.RESTORE, state };
}

export default { updatePortfolioBoxes, restorePortfolio };
