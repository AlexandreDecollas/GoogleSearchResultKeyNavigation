import GlobalState from '../constants/global-state';

export default interface IGoogleSearchNavigator {
    navigate(event: KeyboardEvent, state: GlobalState): void;
}
