/* eslint-disable react/state-in-constructor */
/* eslint-disable import/no-cycle */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import { PureComponent, useRef } from 'react';
import {
    ConnectDragSource,
    DragSource,
    DragSourceConnector,
    DragSourceMonitor,
} from 'react-dnd';
import { Rnd } from 'react-rnd';
import { CloseCircleOutlined } from '@ant-design/icons';
import Resizer from './Resizer/resizer';
import { Direction } from './Resizer/Direction';
//import Portfolio from '../Designer/Portfolio';
// import { deleteBox } from '../Designer/Portfolio';

const widgetStyle: React.CSSProperties = {
    background: '#ddd',
    border: '1px solid black',
    borderRadius: '5px',
    padding: '0.5rem',
};

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
    delete?: (id: string) => void;
    data: T;
    onWidgetList?: boolean;
    setThemePanel?: (node: React.ReactNode) => void;

    connectDragSource: ConnectDragSource;
    isDragging?: boolean;
}

interface IState {
    hover: boolean;
}

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

    const widgetRef = useRef(null);

    class Widget extends React.Component<ResultProps, IState> {
        // static style: any;

        // static getBoundingClientRect(): {
        //     width: any;
        //     height: any;
        //     x: any;
        //     y: any;
        // } {
        //     throw new Error('Method not implemented.');
        // }

        props!: ResultProps;

        state: IState;

        static displayName = `Widget(${
            Component.displayName || Component.name
        })`;

        constructor(props: ResultProps) {
            super(props);
            this.state = {
                hover: false,
            };
        }

        handleResize = (direction, movementX, movementY) => {
            const widget = widgetRef.current;
            if (!widget) return;

            const { width, height, x, y } = widget.getBoundingClientRect();

            const resizeTop = () => {
                widget.style.height = `${height - movementY}px`;
                widget.style.top = `${y + movementY}px`;
            };

            const resizeRight = () => {
                widget.style.width = `${width + movementX}px`;
            };

            const resizeBottom = () => {
                widget.style.height = `${height + movementY}px`;
            };

            const resizeLeft = () => {
                widget.style.width = `${width - movementX}px`;
                widget.style.left = `${x + movementX}px`;
            };

            switch (direction) {
                case Direction.TopLeft:
                    resizeTop();
                    resizeLeft();
                    break;

                case Direction.Top:
                    resizeTop();
                    break;

                case Direction.TopRight:
                    resizeTop();
                    resizeRight();
                    break;

                case Direction.Right:
                    resizeRight();
                    break;

                case Direction.BottomRight:
                    resizeBottom();
                    resizeRight();
                    break;

                case Direction.Bottom:
                    resizeBottom();
                    break;

                case Direction.BottomLeft:
                    resizeBottom();
                    resizeLeft();
                    break;

                case Direction.Left:
                    resizeLeft();
                    break;

                default:
                    break;
            }
        };

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

            const {
                connectDragSource,
                left,
                top,
                onWidgetList,
                id,
            } = this.props;
            const position = onWidgetList ? 'relative' : 'absolute';
            return connectDragSource(
                <div
                    style={{
                        left,
                        top,
                        position,
                        color: 'black',
                        ...widgetStyle,
                    }}
                    className="widget__container"
                    onMouseEnter={() => this.setState({ hover: true })}
                    onMouseLeave={() => this.setState({ hover: false })}
                >
                    <Resizer onResize={this.handleResize} />
                    <div style={{ position: 'relative' }}>
                        <Component {...this.props} />
                        {!this.props.onWidgetList && this.state.hover ? (
                            <CloseCircleOutlined
                                onClick={() => {
                                    if (this.props.delete) {
                                        this.props.delete(this.props.id);
                                    }
                                }}
                                className="btn-close"
                            />
                        ) : (
                            <span />
                        )}
                    </div>
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
