import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Designer from '../components/Designer';
import PortfolioActions from '../actions/portfolio';

function mapStateToProps(state, ownProps) {
    console.log(state);
    return {
        dataStore: ownProps.dataStore,
        github: state.githubapi,
        steam: state.steamapi,
        portfolio: state.portfolio,
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return bindActionCreators(PortfolioActions, dispatch);
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Designer)
);
