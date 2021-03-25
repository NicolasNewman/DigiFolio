/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/state-in-constructor */
/* eslint-disable react/no-unused-state */
import * as React from 'react';
import { Component } from 'react';

import {
    DropTarget,
    ConnectDropTarget,
    DropTargetMonitor,
    XYCoord,
    DropTargetConnector,
} from 'react-dnd';
import update from 'immutability-helper';
import { BoxDragItem } from '../../constants/types';
import { WidgetComponentType } from './IWidget';

function collect(connect: DropTargetConnector, monitor: DropTargetMonitor) {
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
    boxes: {
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
            boxes: {},
        };
    }

    moveBox(id: string, left: number, top: number) {
        this.setState(
            update(this.state, { boxes: { [id]: { $merge: { left, top } } } })
        );
    }

    addBox(id, left, top, component: WidgetComponentType) {
        this.setState(
            update(this.state, {
                boxes: {
                    $merge: {
                        [id]: { title: 'hi', left, top, component },
                    },
                },
            })
        );
    }

    render() {
        // eslint-disable-next-line prettier/prettier
        const { hideSourceOnDrag, connectDropTarget, hovered } = this.props;
        //const backgroundColor = hovered ? '#F0F02D' : 'white';
        const backgroundColor = hovered ? '0px 0px 40px black' : '';
        const { boxes } = this.state;
        return connectDropTarget(
            <div className="portfolio">
                <div
                    className="portfolio__page"
                    id="portfolio"
                    style={{
                        boxShadow: backgroundColor,
                        position: 'relative',
                    }}
                >
                    <p style={{ color: '#000000' }}>This is my page</p>
                    {Object.keys(boxes).map((key) => {
                        const { left, top, title, component } = boxes[key];
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
    'widget',
    {
        drop(
            props: IProps,
            monitor: DropTargetMonitor,
            component: Portfolio | null
        ) {
            if (!component) {
                return;
            }

            const item = monitor.getItem<BoxDragItem>();
            if (!component.state.boxes[item.id]) {
                const delta = monitor.getClientOffset() as XYCoord;
                const left = Math.round(delta.x - 64); // TODO figure out where this value (64) comes from. It will cause issues if we change the styling
                const top = Math.round(delta.y - 64);
                component.addBox(item.id, left, top, item.component);
            } else {
                const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
                const left = Math.round(item.left + delta.x);
                const top = Math.round(item.top + delta.y);
                component.moveBox(item.id, left, top);
            }
        },
    },
    collect
)(Portfolio);
