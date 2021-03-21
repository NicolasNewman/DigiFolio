import { constants } from 'http2';

const ItemTypes = {
    WIDGET: 'widget',
};
export interface BoxDragItem {
    id: string;
    left: number;
    top: number;
}

export default ItemTypes;
