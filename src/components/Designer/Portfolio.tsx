import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { Button } from 'antd';
import { DropTarget, useDrop } from 'react-dnd';
import PropTypes from 'prop-types';
import { Connect } from 'react-redux';
import ItemTypes from '../../constants/types';
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

class Portfolio extends Component<IProps> {
    props!: IProps;

    constructor(props, history) {
        super(props);
    }

    render() {
        const { connectDropTarget, hovered } = this.props;
        //const { connectDropTarget } = this.props;
        //const hovered = this.props;
        const backgroundColor = hovered ? '#F0F02D' : 'white';
        return connectDropTarget(
            <div className="portfolio">
                <div
                    className="portfolio__page"
                    style={{ background: backgroundColor }}
                >
                    <div>This is my page</div>
                </div>
            </div>
        );
    }
}
export default DropTarget('widget', {}, collect)(Portfolio);
