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

export type WidgetComponentType =
    | React.ComponentClass<any>
    | React.FunctionComponent<any>;

export interface ExternalProps<T> {
    id: any;
    // data: T;
    component: WidgetComponentType;
    left?: number;
    top?: number;
    hideSourceOnDrag?: boolean;
    data: T;
    onWidgetList?: boolean;

    connectDragSource: ConnectDragSource;
    isDragging?: boolean;
}

// export interface InjectedProps<T> {
//     data: T;
// }

interface Options {
    test?: string;
}

export const widgetFactory = ({ test = '' }: Options = {}) => <
    T,
    TOriginalProps extends {}
>(
    Component:
        | React.ComponentClass<TOriginalProps>
        | React.FunctionComponent<TOriginalProps>
) => {
    type ResultProps = TOriginalProps & ExternalProps<T>;

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
            console.log('HOC RENDER');
            // console.log(this.props.data);
            if (isDragging) {
                return null;
            }

            const { connectDragSource, left, top, onWidgetList } = this.props;
            const position = onWidgetList ? 'relative' : 'absolute';
            return connectDragSource(
                <div style={{ left, top, position, color: 'black' }}>
                    <Component {...this.props} />
                </div>
            );
        }
    }

    const result = DragSource(
        'widget',
        {
            beginDrag: (props: ResultProps) => {
                console.log('========== BEING DRAG ==========');
                console.log(props);
                const { id, left, top, component, data } = props;
                return { id, left, top, component, data };
            },
            endDrag: (
                props: ResultProps,
                monitor: DragSourceMonitor,
                component:
                    | React.ComponentClass<TOriginalProps>
                    | React.FunctionComponent<TOriginalProps>
            ) => {
                console.log('========== END DRAG ==========');
                console.log(props);
                console.log(monitor);
                console.log(component);
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
