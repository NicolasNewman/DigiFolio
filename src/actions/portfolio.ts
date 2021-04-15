import { WidgetComponentType } from '../components/widgets/IWidget';
import { Boxes } from '../types/Portfolio';

export enum PortfolioAPITypeKeys {
    UPDATE_BOXES = 'UPDATE_BOXES',
}

interface UpdateBoxesAction {
    type: PortfolioAPITypeKeys.UPDATE_BOXES;
    boxes: Boxes;
}

export type PortfolioAPITypes = UpdateBoxesAction;

export function updatePortfolioBoxes(boxes: Boxes) {
    return {
        type: PortfolioAPITypeKeys.UPDATE_BOXES,
        boxes,
    };
}

export default { updatePortfolioBoxes };
