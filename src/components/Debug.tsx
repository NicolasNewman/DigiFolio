/* eslint-disable @typescript-eslint/no-empty-interface */
import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
// import { Redirect } from 'react-router';
import { Button } from 'antd';
import DataStore from '../classes/DataStore';
import routes from '../constants/routes';

import mainIcon from '../../assets/digifolio_icon.png';

interface IProps extends RouteComponentProps<any> {}

export default class Debug extends Component<IProps> {
    props!: IProps;

    constructor(props, history) {
        super(props);
    }

    toPage(route: string, e) {
        const { history } = this.props;
        history.push(route);
    }

    render() {
        // if (this.state.toHome) {
        //     return <Redirect to="/home" />;
        // }
        return (
            <div>
                <p>Debug</p>
            </div>
        );
    }
}
