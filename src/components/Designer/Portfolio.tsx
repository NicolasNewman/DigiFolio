import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { Button } from 'antd';
import { DropTarget, DropTargetMonitor, XYCoord } from 'react-dnd';
import PropTypes from 'prop-types';
import { Connect } from 'react-redux';
import update from 'immutability-helper';
import { BoxDragItem } from '../../constants/types';
//import ItemTypes from '../../constants/types';
import Widget from './Widget';

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
    connectDropTarget;
    hovered;
}

export interface ContainerState {
    boxes: { [key: string]: { top: number; left: number; title: string } };
}

class Portfolio extends Component<IProps, ContainerState> {
    props!: IProps;

    constructor(props) {
        super(props);
        this.state = {
            boxes: {
                a: { top: 200, left: 80, title: 'Drag me around' },
                b: { top: 180, left: 20, title: 'Drag me too' },
            },
        };
    }

    public moveBox(id: string, left: number, top: number) {
        this.setState(
            // eslint-disable-next-line react/no-access-state-in-setstate
            update(this.state, {
                boxes: {
                    [id]: {
                        $merge: { left, top },
                    },
                },
            })
        );
    }

    render() {
        const { connectDropTarget, hovered } = this.props;
        //const { connectDropTarget } = this.props;
        //const hovered = this.props;
        const backgroundColor = hovered ? '#F0F02D' : 'white';
        const { boxes } = this.state;
        return connectDropTarget(
            <div className="portfolio">
                <div
                    className="portfolio__page"
                    id="portfolio"
                    style={{ background: backgroundColor }}
                >
                    <p style={{ color: '#000000' }}>This is my page</p>
                    <div>
                        {Object.keys(boxes).map((key) => {
                            const { left, top, title } = boxes[key];
                            return (
                                <Widget
                                    key={key}
                                    id={key}
                                    left={left}
                                    top={top}
                                    //hideSourceOnDrag={hideSourceOnDrag}
                                >
                                    {title}
                                </Widget>
                            );
                        })}
                    </div>
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
            const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
            const left = Math.round(item.left + delta.x);
            const top = Math.round(item.top + delta.y);

            component.moveBox(item.id, left, top);
        },
    },
    collect
)(Portfolio);
