import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
// import { Redirect } from 'react-router';
import { Button } from 'antd';
import DataStore from '../classes/DataStore';
import routes from '../constants/routes';

import mainIcon from '../../assets/digifolio_icon.png';

interface IProps extends RouteComponentProps<any> {
    dataStore: DataStore;
}

export default class Home extends Component<IProps> {
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
            <div className="home">
                <img className="home__img" src={mainIcon} alt="Logo" />
                <h3>Welcome to DigiFolio!</h3>
                <h4>Begin by Creating a New Portfolio!</h4>
                <Button
                    className="home__button"
                    type="primary"
                    onClick={(e) => this.toPage(routes.DESIGNER, e)}
                >
                    New Portfolio
                </Button>
                <Button
                    className="home__button"
                    type="primary"
                    onClick={(e) => this.toPage(routes.SETTINGS, e)}
                >
                    Settings
                </Button>
                <Button
                    className="home__button"
                    type="primary"
                    onClick={(e) => this.toPage(routes.DEBUG, e)}
                >
                    Grafhs
                </Button>
            </div>
        );
    }
}
