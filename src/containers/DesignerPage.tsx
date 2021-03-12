import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Designer from '../components/Designer';
import CounterActions from '../actions/counter';

function mapStateToProps(state, ownProps) {
    return {
        dataStore: ownProps.dataStore,
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return bindActionCreators(CounterActions, dispatch);
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Designer)
);
