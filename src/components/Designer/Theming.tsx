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
            <div style={{ textAlign: 'center' }}>
                <h3>Themes!</h3>
                {this.props.themePanel}
            </div>
        );
    }
}
