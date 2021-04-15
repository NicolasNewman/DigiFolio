/* eslint-disable react/state-in-constructor */
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
import { CloseCircleOutlined } from '@ant-design/icons';
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
    TOriginalProps extends {},
    TOriginalState extends {} = {}
>(
    Component: React.ComponentClass<
        TOriginalProps & {
            saveState: (state: TOriginalState) => void;
            restoreState: () => TOriginalState;
        },
        TOriginalState
    >
    // | React.FunctionComponent<TOriginalProps>
) => {
    type ResultProps = TOriginalProps & ExternalProps<T>;

    class Widget extends React.Component<ResultProps, IState> {
        props!: ResultProps;

        state: IState;

        savedState: TOriginalState | null = null;

        // InitComponent: React.ReactElement<TOriginalProps>;

        componentRef: React.RefObject<any>;

        static displayName = `Widget(${
            Component.displayName || Component.name
        })`;

        constructor(props: ResultProps) {
            super(props);
            // this.InitComponent = <Component ref={} {...props} />;
            this.componentRef = React.createRef();
            this.state = {
                hover: false,
            };
        }

        render(): React.ReactElement<
            any,
            string | React.JSXElementConstructor<any>
        > | null {
            const { isDragging } = this.props;
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
                    <div style={{ position: 'relative' }}>
                        <Component
                            ref={this.componentRef}
                            {...this.props}
                            saveState={(state: TOriginalState) => {
                                this.savedState = state;
                            }}
                            restoreState={() => {
                                return this.savedState;
                            }}
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
                funcComponent
            ) => {
                console.log('========== BEING DRAG ==========');
                console.log(props);
                console.log(funcComponent);
                const { id, left, top, component, data } = props;
                return { id, left, top, component, data };
            },
            endDrag: (
                props: ResultProps,
                monitor: DragSourceMonitor,
                component
            ) => {
                console.log('========== END DRAG ==========');
                console.log(props);
                console.log(monitor);
                // console.log(component);
                // if (component) {
                //     console.log(component);
                //     console.log(component?.componentRef);
                //     console.log(component.componentRef?.current);
                //     // component.componentRef.current.replaceState(
                //     //     component.savedState
                //     // );
                // }
                // component.getState();
            },
        },
        (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging(),
        })
    )(Widget);

    return result;
};
