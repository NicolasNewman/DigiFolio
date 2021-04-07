import * as React from 'react';
import { Component, PureComponent } from 'react';

interface IProps {}

export default class Theming extends PureComponent<IProps> {
    props!: IProps;

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <p>Themes!</p>
            </div>
        );
    }
}
