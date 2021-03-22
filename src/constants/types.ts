/* eslint-disable import/no-cycle */
import { WidgetComponentType } from '../components/Designer/IWidget';

export interface BoxDragItem {
    id: string;
    left: number;
    top: number;
    component: WidgetComponentType;
}
