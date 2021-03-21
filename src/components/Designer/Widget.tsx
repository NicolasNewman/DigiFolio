import * as React from 'react';
import { CSSProperties, FC } from 'react';
import { useDrag, ConnectDragSource, DragSource } from 'react-dnd';
import { RouteComponentProps } from 'react-router';
import { Disposable } from 'custom-electron-titlebar/lib/common/lifecycle';
// import DataStore from '../classes/DataStore';
import ITEM_TYPE from '../../constants/types';

const style: CSSProperties = {
    position: 'absolute',
    border: '1px dashed gray',
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
    cursor: 'move',
    color: 'black',
};

export interface WidgetProps {
    id: any;
    left: number;
    top: number;
    hideSourceOnDrag?: boolean;

    // Collected Props
    connectDragSource: ConnectDragSource;
    isDragging?: boolean;
}

const Widget: FC<WidgetProps> = ({
    hideSourceOnDrag,
    left,
    top,
    connectDragSource,
    isDragging,
    children,
}) => {
    if (isDragging && hideSourceOnDrag) {
        return null;
    }

    return connectDragSource(
        <div
            style={{ ...style, left, top }}
            className="widgetContainer"
            role="none"
        >
            {children}
        </div>
    );
};

export default DragSource(
    ITEM_TYPE.WIDGET,
    {
        beginDrag(props: WidgetProps) {
            const { id, left, top } = props;
            return { id, left, top };
        },
    },
    (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    })
)(Widget);

// function Widget() {
//     const [{ isDragging }, drag] = useDrag(() => ({
//         type: ITEM_TYPE.WIDGET,
//         collect: (monitor) => ({
//             isDragging: !!monitor.isDragging(),
//         }),
//     }));

//     return (
//         <div
//             className="widgetContainer"
//             ref={drag}
//             style={{
//                 opacity: isDragging ? 0 : 1,
//                 cursor: 'move',
//             }}
//         >
//             Widget
//         </div>
//     );
// }
// export default Widget;
