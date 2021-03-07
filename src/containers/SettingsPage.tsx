import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
// The Designer import is the root component for the page you are creating
import { withRouter } from 'react-router';
import Settings from '../components/Settings';
// Also import any redux actions you might need
// import MyReduxActions from '../actions/event';
import CounterActions from '../actions/counter';

function mapStateToProps(state, ownProps) {
    return {
        // data store should always be passed
        dataStore: ownProps.dataStore,
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return bindActionCreators(CounterActions, dispatch);
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Settings)
); // add the component you imported as a paremeter
