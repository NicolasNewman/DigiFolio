import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Designer from '../components/Designer';
import CounterActions from '../actions/counter';

function mapStateToProps(state, ownProps) {
    console.log(state);
    return {
        dataStore: ownProps.dataStore,
        github: state.githubapi,
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return bindActionCreators(CounterActions, dispatch);
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Designer)
);
