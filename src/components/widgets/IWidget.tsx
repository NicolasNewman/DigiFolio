/* eslint-disable import/no-cycle */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import { PureComponent } from 'react';
import {
    ConnectDragSource,
    DragSource,
    DragSourceConnector,
    DragSourceMonitor,
} from 'react-dnd';
//import Portfolio from '../Designer/Portfolio';
import { deleteBox } from '../Designer/Portfolio';

export type WidgetComponentType =
    | React.ComponentClass<any>
    | React.FunctionComponent<any>;

export interface ExternalProps {
    id: any;
    component: WidgetComponentType;
    left?: number;
    top?: number;
    hideSourceOnDrag?: boolean;
    onWidgetList?: boolean;

    connectDragSource: ConnectDragSource;
    isDragging?: boolean;
}

interface Options {
    test?: string;
}

function handleRemove(id) {
    // Remove widget from page
    console.log(id);
    deleteBox(id);
}

export const widgetFactory = ({ test = '' }: Options = {}) => <
    TOriginalProps extends {}
>(
    Component:
        | React.ComponentClass<TOriginalProps>
        | React.FunctionComponent<TOriginalProps>
) => {
    type ResultProps = TOriginalProps & ExternalProps;

    class Widget extends PureComponent<ResultProps> {
        props!: ResultProps;

        static displayName = `Widget(${
            Component.displayName || Component.name
        })`;

        constructor(props: ResultProps) {
            super(props);
        }

        render(): React.ReactElement<
            any,
            string | React.JSXElementConstructor<any>
        > | null {
            const { isDragging } = this.props;
            if (isDragging) {
                return null;
            }

            const {
                connectDragSource,
                left,
                top,
                onWidgetList,
                id,
            } = this.props;
            const position = onWidgetList ? 'relative' : 'absolute';
            return connectDragSource(
                <div style={{ left, top, position, color: 'black' }}>
                    <Component {...this.props} />
                    <button type="button" onClick={() => handleRemove(id)}>
                        remove
                    </button>
                </div>
            );
        }
    }

    const result = DragSource(
        'widget',
        {
            beginDrag: (props: ResultProps) => {
                const { id, left, top, component } = props;
                return { id, left, top, component };
            },
        },
        (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging(),
        })
    )(Widget);

    return result;
};

// export abstract class IWidget<P = {}> extends PureComponent<P & IWidgetProps> {
//     props!: P & IWidgetProps;

//     constructor(props) {
//         super(props);
//     }

//     abstract mapData();

//     render() {
//         const { connectDragSource, left, top } = this.props;
//         return connectDragSource(
//             <div style={{ left, top, position: 'absolute', color: 'black' }}>
//                 <p>Hello</p>
//             </div>
//         );
//     }
// }

// export default DragSource(
//     ItemTypes.WIDGET,
//     {
//         beginDrag: (props: IWidgetProps) => {
//             const { id, left, top } = props;
//             return { id, left, top };
//         },
//     },
//     (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
//         connectDragSource: connect.dragSource(),
//         isDragging: monitor.isDragging(),
//     })
// )(IWidget);
