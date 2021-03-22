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
import { ItemTypes } from '../../constants/types';

interface IProps {
    id: any;
    left?: number;
    top?: number;
    hideSourceOnDrag?: boolean;

    connectDragSource: ConnectDragSource;
    isDragging?: boolean;
}

class Widget extends PureComponent<IProps> {
    props!: IProps;

    constructor(props) {
        super(props);
    }

    render() {
        const { connectDragSource, left, top } = this.props;
        return connectDragSource(
            <div style={{ left, top, position: 'absolute', color: 'black' }}>
                <p>Hello</p>
            </div>
        );
    }
}

export default DragSource(
    ItemTypes.WIDGET,
    {
        beginDrag: (props: IProps) => {
            const { id, left, top } = props;
            return { id, left, top };
        },
    },
    (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    })
)(Widget);
