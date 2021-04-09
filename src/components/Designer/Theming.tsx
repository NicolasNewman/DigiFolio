import * as React from 'react';
import { Component, PureComponent } from 'react';

interface IProps {
    themePanel: React.ReactNode;
}

export default class Theming extends PureComponent<IProps> {
    props!: IProps;

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <p>Themes!</p>
                {this.props.themePanel}
            </div>
        );
    }
}
