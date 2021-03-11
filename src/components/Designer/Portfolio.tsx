/* eslint-disable react/self-closing-comp */
import * as React from 'react';
import { PureComponent } from 'react';
import { Button } from 'antd';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {}

export default class Portfolio extends PureComponent<IProps> {
    props!: IProps;

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="portfolio" id="portfolio">
                <div className="portfolio__page">
                    <p>This is my page</p>
                </div>
            </div>
        );
    }
}
