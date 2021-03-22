/* eslint-disable import/no-cycle */
import { WidgetComponentType } from '../components/Designer/IWidget';

export const ItemTypes = {
    WIDGET: 'widget',
};

export interface WidgetDragItem {
    id: string;
    left: number;
    top: number;
    component: WidgetComponentType;
}
