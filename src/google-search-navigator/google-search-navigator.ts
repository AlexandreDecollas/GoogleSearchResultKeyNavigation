import GlobalState from "../constants/global-state";
import IGoogleSearchNavigator from "./google-search-navigator.interface";
import {
  ARROW_DOWN_KEY,
  ARROW_UP_KEY,
  ESCAPE_KEY,
  HIGHLIGHT_CLASSNAME,
  SEARCH_BAR_CSS,
  TAB_KEY,
} from "../constants/global.constant";
import isNil from "lodash/isNil";

export default class GoogleSearchNavigator implements IGoogleSearchNavigator {
  public navigate(event: KeyboardEvent, state: GlobalState): void {
    if (
      event.key === ARROW_DOWN_KEY &&
      GoogleSearchNavigator._isNotTheLastElement(
        state.pointerPosition,
        state.linkSections.length
      ) &&
      !state.browsingSuggestions
    ) {
      GoogleSearchNavigator._highLightNextSection(state);
      event.preventDefault();
      return;
    }
    if (
      event.key === ARROW_UP_KEY &&
      GoogleSearchNavigator._isNotTheFirstElement(state.pointerPosition) &&
      !state.browsingSuggestions
    ) {
      GoogleSearchNavigator._highLightPreviousSection(state);
      event.preventDefault();
      return;
    }
    if (event.key === ESCAPE_KEY) {
      GoogleSearchNavigator._unHighLightSection(state);
      state.pointerPosition = -1;
      state.browsingSuggestions = true;
      GoogleSearchNavigator._selectSearchBar();
      event.preventDefault();
      return;
    }
    if (event.key === TAB_KEY && state.pointerPosition === -1) {
      state.pointerPosition = 0;
      state.browsingSuggestions = false;
      GoogleSearchNavigator._highLighSection(state);
      event.preventDefault();
    }
  }

  private static _selectSearchBar(): void {
    const searchBar: Element = document.body.getElementsByClassName(
      SEARCH_BAR_CSS
    )[0];
    (<HTMLInputElement>searchBar).select();
    window.scrollTo(0, 0);
  }

  private static _isNotTheLastElement(
    position: number,
    listLength: number
  ): boolean {
    return position < listLength - 1;
  }

  private static _isNotTheFirstElement(pointerPosition: number): boolean {
    return pointerPosition > 0;
  }

  private static _highLightNextSection(state: GlobalState): void {
    GoogleSearchNavigator._unHighLightSection(state);
    state.pointerPosition++;
    GoogleSearchNavigator._highLighSection(state);
    GoogleSearchNavigator._scrollToSection(state);
  }

  private static _scrollToSection(state: GlobalState): void {
    state.linkSections[state.pointerPosition].scrollIntoView(false);
  }

  private static _highLightPreviousSection(state: GlobalState): void {
    GoogleSearchNavigator._unHighLightSection(state);
    state.pointerPosition--;
    GoogleSearchNavigator._highLighSection(state);
    GoogleSearchNavigator._scrollToSection(state);
  }

  private static _highLighSection(state: GlobalState): void {
    state.linkSections[state.pointerPosition].classList.add(
      HIGHLIGHT_CLASSNAME
    );
    (<HTMLElement>state.linkSections[state.pointerPosition])
      .getElementsByTagName("a")[0]
      .focus();
  }

  private static _unHighLightSection(state: GlobalState): void {
    if (
      GoogleSearchNavigator._isNavigationStartedAndElementClassesNotNull(state)
    ) {
      const classList: DOMTokenList =
        state.linkSections[state.pointerPosition].classList;
      classList.remove(HIGHLIGHT_CLASSNAME);
    }
  }

  private static _isNavigationStartedAndElementClassesNotNull(
    state: GlobalState
  ): boolean {
    const element: HTMLElement = <HTMLElement>(
      state.linkSections[state.pointerPosition]
    );
    return state.pointerPosition >= 0 && !isNil(element.classList);
  }
}
