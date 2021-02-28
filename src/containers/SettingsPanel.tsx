import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
// The Designer import is the root component for the page you are creating
import MyComponent from '../components/MyComponent';
// Also import any redux actions you might need
import MyReduxActions from '../actions/event';

function mapStateToProps(state, ownProps) {
    return {
        // data store should always be passed
        dataStore: ownProps.dataStore,
        // everything below is optional based on the fields the page needs from the redux store
        gameProperties: state.game.gameProperties,
        events: state.event,
        states: state.state,
        groups: state.group,
        file: state.core.file,
        mode: state.core.mode,
        formLayout: state.form.formLayout,
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return bindActionCreators(
        {
            // expand all of the redux actions you imported below
            ...MyReduxActions,
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent); // add the component you imported as a paremeter
