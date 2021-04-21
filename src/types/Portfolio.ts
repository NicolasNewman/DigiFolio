import { WidgetComponentType } from '../components/widgets/IWidget';

export type Boxes = {
    [key: string]: {
        top: number;
        left: number;
        title: string;
        component: WidgetComponentType;
        data: any;
    };
};

export type RestoreBoxes = {
    [key: string]: {
        top: number;
        left: number;
        title: string;
        component: string;
        data: any;
    };
};
