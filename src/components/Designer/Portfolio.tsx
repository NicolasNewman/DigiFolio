/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/state-in-constructor */
/* eslint-disable react/no-unused-state */
import * as React from 'react';
import { Component } from 'react';
// import { RouteComponentProps } from 'react-router';
// import { Button } from 'antd';
import {
    DropTarget,
    ConnectDropTarget,
    DropTargetMonitor,
    XYCoord,
    DropTargetConnector,
} from 'react-dnd';
import update from 'immutability-helper';
import Widget from './Widget';
import { WidgetDragItem, ItemTypes } from '../../constants/types';
import { WidgetComponentType } from './IWidget';
// import PropTypes from 'prop-types';
// import { Connect } from 'react-redux';
// import ItemTypes from '../../constants/types';
// import Widget from './Widget';
//import Item from 'antd/lib/list/Item';
// import DataStore from '../classes/DataStore';

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        hovered: monitor.isOver(),
    };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {
    hovered;
    hideSourceOnDrag: boolean;
    connectDropTarget: ConnectDropTarget;
}

interface IState {
    widgets: {
        [key: string]: {
            top: number;
            left: number;
            title: string;
            component: WidgetComponentType;
        };
    };
}

class Portfolio extends Component<IProps, IState> {
    props!: IProps;

    state: IState;

    constructor(props) {
        super(props);
        this.state = {
            widgets: {
                // a: { top: 100, left: 100, title: 'hello bob' },
            },
        };
    }

    moveWidget(id: string, left: number, top: number) {
        this.setState(
            update(this.state, { widgets: { [id]: { $merge: { left, top } } } })
        );
    }

    addWidget(id, left, top, component: WidgetComponentType) {
        this.setState(
            update(this.state, {
                widgets: {
                    $merge: {
                        [id]: { title: 'hi', left, top, component },
                    },
                },
            })
        );
    }

    render() {
        const { hideSourceOnDrag, connectDropTarget, hovered } = this.props;
        const { widgets } = this.state;
        const backgroundColor = hovered ? '#F0F02D' : 'white';

        return connectDropTarget(
            <div className="portfolio">
                <div
                    className="portfolio__page"
                    id="portfolio"
                    style={{
                        background: backgroundColor,
                        position: 'relative',
                    }}
                >
                    <p style={{ color: '#000000' }}>This is my page</p>
                    {Object.keys(this.state.widgets).map((key) => {
                        const {
                            left,
                            top,
                            title,
                            component,
                        } = this.state.widgets[key];
                        const WidgetComponent = component;
                        return (
                            <WidgetComponent
                                key={key}
                                id={key}
                                left={left}
                                top={top}
                                hideSourceOnDrag={hideSourceOnDrag}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }
}
export default DropTarget(
    ItemTypes.WIDGET,
    {
        drop(
            props: IProps,
            monitor: DropTargetMonitor,
            component: Portfolio | null
        ) {
            if (!component) {
                return;
            }
            const item = monitor.getItem<WidgetDragItem>();

            console.log(item);
            if (!component.state.widgets[item.id]) {
                const delta = monitor.getClientOffset() as XYCoord;
                const left = Math.round(delta.x - 64); // TODO figure out where this value (64) comes from. It will cause issues if we change the styling
                const top = Math.round(delta.y - 64);
                component.addWidget(item.id, left, top, item.component);
            } else {
                const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
                const left = Math.round(item.left + delta.x);
                const top = Math.round(item.top + delta.y);
                component.moveWidget(item.id, left, top);
            }
        },
    },
    (connect: DropTargetConnector) => ({
        connectDropTarget: connect.dropTarget(),
    })
)(Portfolio);
