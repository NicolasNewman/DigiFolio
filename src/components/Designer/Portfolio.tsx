import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { Button } from 'antd';
// import DataStore from '../classes/DataStore';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {}

export default class Portfolio extends Component<IProps> {
    props!: IProps;

    constructor(props, history) {
        super(props);
    }

    render() {
        return <p>Portfolio!</p>;
    }
}
