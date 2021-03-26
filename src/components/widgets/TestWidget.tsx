import * as React from 'react';
import { PureComponent } from 'react';
import { widgetFactory } from './IWidget';

interface IProps {}

class ChartWidget extends PureComponent<IProps> {
    props!: IProps;

    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <p>Hello world!!!</p>
            </div>
        );
    }
}

const Demo = widgetFactory()(ChartWidget);
export default Demo;
