import * as React from 'react';
import { PureComponent, Fragment } from 'react';

export default class App extends PureComponent {
    render() {
        // eslint-disable-next-line react/prop-types
        const { children } = this.props;
        return <>{children}</>;
    }
}
