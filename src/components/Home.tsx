import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps } from 'react-router';
// import { Redirect } from 'react-router';
import DataStore from '../classes/DataStore';
// import routes from '../constants/routes';

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
            <div className="landingContainer">
                <img src={mainIcon} alt="Logo" />
                <h3>Welcome to DigiFolio!</h3>
                <h4>Begin by Creating a New Portfolio!</h4>
            </div>
        );
    }
}
