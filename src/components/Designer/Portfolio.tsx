import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { Button } from 'antd';
import { DropTarget, useDrop } from 'react-dnd';
import PropTypes from 'prop-types';
import { Connect } from 'react-redux';
import ItemTypes from '../../constants/types';
import Widget from './Widget';
// import DataStore from '../classes/DataStore';

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        hovered: monitor.isOver(),
        //widget: monitor.getWidget(),
    };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {}

class Portfolio extends Component<IProps> {
    props!: IProps;

    constructor(props, history) {
        super(props);
    }

    render() {
        // const [, drop] = useDrop(() => ({
        //     accept: ItemTypes.WIDGET,
        //     collect: (monitor) => ({
        //         isOver: !!monitor.isOver(),
        //     }),
        // }));

        // const { connectDropTarget, hovered } = this.props;
        const hovered = this.props;
        const backgroundColor = hovered ? '#F0F02D' : 'white';
        return (
            <div className="portfolio">
                <div
                    className="portfolio__page"
                    style={{ background: backgroundColor }}
                >
                    <p>This is my page</p>
                </div>
            </div>
        );
    }
}
export default DropTarget('widget', {}, collect)(Portfolio);
