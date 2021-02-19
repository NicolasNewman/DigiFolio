import { CounterTypeKeys, CounterTypes } from '../actions/counter';

export default function counter(state = 0, action: CounterTypes) {
    switch (action.type) {
        case CounterTypeKeys.INCREMENT_COUNTER:
            return state + 1;
        case CounterTypeKeys.DECREMENT_COUNTER:
            return state - 1;
        default:
            return state;
    }
}
