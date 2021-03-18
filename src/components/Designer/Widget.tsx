import * as React from 'react';
import { useDrag } from 'react-dnd';
import { RouteComponentProps } from 'react-router';
import { Disposable } from 'custom-electron-titlebar/lib/common/lifecycle';
// import DataStore from '../classes/DataStore';
import ITEM_TYPE from '../../constants/types';

function Widget() {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ITEM_TYPE.WIDGET,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div
            className="widgetContainer"
            ref={drag}
            style={{
                opacity: isDragging ? 0 : 1,
                cursor: 'move',
            }}
        >
            Widget
        </div>
    );
}
export default Widget;
