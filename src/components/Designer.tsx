import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// import { Redirect } from 'react-router';
import { Button } from 'antd';
import { LeftCircleOutlined } from '@ant-design/icons';
import DataStore from '../classes/DataStore';
import routes from '../constants/routes';
import Portfolio from './Designer/Portfolio';
import Widgets from './Designer/Widgets';

interface IProps extends RouteComponentProps<any> {
    dataStore: DataStore;
}

export default class Designer extends Component<IProps> {
    props!: IProps;

    constructor(props, history) {
        super(props);
    }

    toPage(route: string, e) {
        const { history } = this.props;
        history.push(route);
    }

    render() {
        return (
            <div>
                <DndProvider backend={HTML5Backend}>
                    <div className="designer">
                        <div className="designer__portfolio">
                            <Portfolio />
                        </div>
                        <div className="designer__widgets">
                            <Widgets />
                        </div>
                    </div>
                </DndProvider>

                <div className="designer-button-container">
                    <Button
                        type="primary"
                        shape="round"
                        icon={<LeftCircleOutlined />}
                        size="middle"
                        onClick={(e) => this.toPage(routes.HOME, e)}
                    >
                        Return
                    </Button>
                </div>
            </div>
        );
    }
}
