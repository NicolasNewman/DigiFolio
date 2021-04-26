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
// import { Rnd } from 'react-rnd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { ResizableBox } from 'react-resizable';

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
    component: WidgetComponentType;
    left?: number;
    top?: number;
    state?: any;
    hideSourceOnDrag?: boolean;
    delete?: (id: string) => void;
    data: T;
    onWidgetList?: boolean;
    setThemePanel?: (node: React.ReactNode) => void;

    connectDragSource: ConnectDragSource;
    isDragging?: boolean;
    widgetStyle: React.CSSProperties;
}

export interface ComponentExtendedProps<S> {
    saveState: (state: S) => void;
    restoreState: () => S;
    width: number;
    height: number;
    setHOCState: (state: IState) => void;
}

interface IState {
    hover: boolean;
    width: number;
    height: number;
}

interface Options {
    test?: string;
}

export const widgetFactory = ({ test = '' }: Options = {}) => <
    T,
    TOriginalProps extends {},
    TOriginalState extends {} = {}
>(
    Component: React.ComponentClass<
        TOriginalProps & {
            saveState: (state: TOriginalState) => void;
            restoreState: () => TOriginalState;
            setHOCState: (state: IState) => void;
            width: number;
            height: number;
        },
        TOriginalState
    >
    // | React.FunctionComponent<TOriginalProps>
) => {
    type ResultProps = TOriginalProps & ExternalProps<T>;
    let draggable = true;
    class Widget extends React.Component<ResultProps, IState> {
        props!: ResultProps;

        state: IState;

        savedState: TOriginalState | null = null;

        // draggable: boolean = true;

        static displayName = `Widget(${
            Component.displayName || Component.name
        })`;

        constructor(props: ResultProps) {
            super(props);
            this.state = {
                hover: false,
                width: 250,
                height: 250,
            };
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

            const html = (
                <div style={{ position: 'relative' }}>
                    <Component
                        {...this.props}
                        saveState={(state: TOriginalState) => {
                            this.savedState = state;
                        }}
                        restoreState={() => {
                            return this.savedState;
                        }}
                        width={this.state.width}
                        height={this.state.height}
                        setHOCState={(state) => this.setState(state)}
                    />
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
            );
            return connectDragSource(
                <div
                    style={{
                        left,
                        top,
                        position,
                        color: 'black',
                        ...widgetStyle,
                        ...this.props.widgetStyle,
                    }}
                    className="widget__container"
                    onMouseEnter={() => this.setState({ hover: true })}
                    onMouseLeave={() => this.setState({ hover: false })}
                >
                    {this.props.onWidgetList ? (
                        html
                    ) : (
                        <ResizableBox
                            width={this.state.width}
                            height={this.state.height}
                            minConstraints={[25, 25]}
                            maxConstraints={[600, 600]}
                            onResizeStop={(e, data) => {
                                // console.log(`New width: ${data.size.width}`);
                                // console.log(`New height: ${data.size.height}`);
                                this.setState({
                                    width: data.size.width,
                                    height: data.size.height,
                                });
                            }}
                            handle={
                                <span
                                    onPointerEnter={(e) => {
                                        // console.log('Enter');
                                        draggable = false;
                                    }}
                                    onPointerLeave={(e) => {
                                        // console.log('Exit');
                                        draggable = true;
                                    }}
                                    className="react-resizable-handle react-resizable-handle-se"
                                />
                            }
                        >
                            {html}
                        </ResizableBox>
                    )}
                </div>
            );
        }
    }

    const result = DragSource(
        'widget',
        {
            beginDrag: (
                props: ResultProps,
                monitor: DragSourceMonitor,
                widgetComponent: any
            ) => {
                // console.log('========== BEING DRAG ==========');
                // console.log(props);
                // console.log(widgetComponent);
                // console.log(widgetComponent.savedState);
                const { id, left, top, component, data } = props;
                return {
                    id,
                    left,
                    top,
                    component,
                    data,
                    state: widgetComponent.savedState,
                };
            },
            endDrag: (
                props: ResultProps,
                monitor: DragSourceMonitor,
                component
            ) => {
                // console.log('========== END DRAG ==========');
                // console.log(props);
                // console.log(monitor);
                // console.log(component);
            },
            canDrag: (props, monitor: DragSourceMonitor) => {
                // console.log('========== CAN DRAG ==========');
                // console.log(draggable);
                return draggable;
            },
        },
        (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging(),
        })
    )(Widget);

    return result;
};
