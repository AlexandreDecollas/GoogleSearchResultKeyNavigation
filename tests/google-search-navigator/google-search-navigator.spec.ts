import IGoogleSearchNavigator from "../../src/google-search-navigator/google-search-navigator.interface";
import GoogleSearchNavigator from "../../src/google-search-navigator/google-search-navigator";
import GlobalState from "../../src/constants/global-state";
import IGoogleSearchParser from "../../src/google-search-parser/google-search-parser.interface";
import GoogleSearchParser from "../../src/google-search-parser/google-search-parser";
import {
  ARROW_DOWN_KEY,
  ARROW_UP_KEY,
  ESCAPE_KEY,
  HIGHLIGHT_CLASSNAME,
  SEARCH_BAR_CSS,
  TAB_KEY,
} from "../../src/constants/global.constant";

describe("GoogleSearchNavigator", () => {
  const googleSearchNavigator: IGoogleSearchNavigator = new GoogleSearchNavigator();

  let dumbHtmlElement: HTMLElement;

  const eventArrowUpKey: KeyboardEvent = new KeyboardEvent("keydown", {
    key: ARROW_UP_KEY,
  });
  const eventArrowDownKey: KeyboardEvent = new KeyboardEvent("keydown", {
    key: ARROW_DOWN_KEY,
  });
  const eventEscapeKey: KeyboardEvent = new KeyboardEvent("keydown", {
    key: ESCAPE_KEY,
  });
  const eventTabKey: KeyboardEvent = new KeyboardEvent("keydown", {
    key: TAB_KEY,
  });

  beforeEach(() => {
    document.body.innerHTML =
      '<div id="rso">' +
      '<input class="gLFyf gsfi" />' +
      '<div class="g"><a href="#"></a></div>' +
      '<div class="g"><a href="#"></a></div>' +
      '<div class="g"><a href="#"></a></div>' +
      '<div class="toto"><a href="#"></a></div>' +
      "</input>";
    dumbHtmlElement = <HTMLElement>document.getElementsByClassName("toto")[0];
    dumbHtmlElement.scrollIntoView = jest.fn();
    spyOn(window, "scrollTo");
  });

  it(`should increase pointer value when ${ARROW_DOWN_KEY} pressed`, () => {
    const state: GlobalState = new GlobalState();
    state.linkSections = [dumbHtmlElement];

    googleSearchNavigator.navigate(eventArrowDownKey, state);
    expect(state.pointerPosition).toEqual(0);
  });

  it("should decrease pointer value when arrowUp is pressed", () => {
    const state: GlobalState = new GlobalState();
    state.pointerPosition = 2;
    state.linkSections = [
      dumbHtmlElement,
      dumbHtmlElement,
      dumbHtmlElement,
      dumbHtmlElement,
    ];
    googleSearchNavigator.navigate(eventArrowUpKey, state);

    expect(state.pointerPosition).toEqual(1);
  });

  it("should not decrease pointer position under 0", () => {
    const state: GlobalState = new GlobalState();
    state.pointerPosition = 0;
    state.linkSections = [
      dumbHtmlElement,
      dumbHtmlElement,
      dumbHtmlElement,
      dumbHtmlElement,
    ];

    googleSearchNavigator.navigate(eventArrowUpKey, state);

    expect(state.pointerPosition).toEqual(0);
  });

  it("should not increase pointer position more than link section list length", () => {
    const state: GlobalState = new GlobalState();
    state.pointerPosition = 2;
    state.linkSections = [dumbHtmlElement, dumbHtmlElement, dumbHtmlElement];

    googleSearchNavigator.navigate(eventArrowDownKey, state);

    expect(state.pointerPosition).toEqual(2);
  });

  describe("Highlighting sections", () => {
    let state: GlobalState;

    beforeEach(() => {
      state = getStateWithMockedBehaviorSections();
      state.pointerPosition = 1;
    });

    it(`should highlight id's corresponding section`, () => {
      googleSearchNavigator.navigate(eventArrowDownKey, state);

      expect(state.linkSections[2].classList.value).toContain(
        HIGHLIGHT_CLASSNAME
      );
    });

    it(`should unhighlight previous highlighted section`, () => {
      googleSearchNavigator.navigate(eventArrowDownKey, state);
      googleSearchNavigator.navigate(eventArrowDownKey, state);

      expect(state.linkSections[1].classList.value).toEqual("g");
    });
  });

  it("should focus on section while hightlighting it", () => {
    const state: GlobalState = new GlobalState();
    state.pointerPosition = 0;

    const googleSearchParser: IGoogleSearchParser = new GoogleSearchParser(
      document
    );

    state.linkSections = googleSearchParser.getLinkSections();
    state.linkSections[1].scrollIntoView = jest.fn();

    googleSearchNavigator.navigate(eventArrowDownKey, state);

    expect(state.linkSections[1].scrollIntoView).toHaveBeenCalledWith(false);
  });

  [ARROW_UP_KEY, ARROW_DOWN_KEY].forEach((keyPressed: string) => {
    it(`should not propagate event when ${keyPressed} pressed`, () => {
      const state: GlobalState = getStateWithMockedBehaviorSections();
      state.pointerPosition = 1;

      const event: KeyboardEvent = new KeyboardEvent("keydown", {
        key: keyPressed,
      });

      spyOn(event, "preventDefault");

      googleSearchNavigator.navigate(event, state);

      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  it("should focus on href link into the section hightlighted", () => {
    const state: GlobalState = getStateWithMockedBehaviorSections();
    state.pointerPosition = 0;

    const event: KeyboardEvent = new KeyboardEvent("keydown", {
      key: ARROW_DOWN_KEY,
    });

    const link: HTMLElement = state.linkSections[1].getElementsByTagName(
      "a"
    )[0];
    spyOn(link, "focus");

    googleSearchNavigator.navigate(event, state);

    expect(link.focus).toHaveBeenCalled();
  });

  it("should reset state pointeur when press key escape", () => {
    const state: GlobalState = new GlobalState();
    state.linkSections = [dumbHtmlElement];
    state.pointerPosition = 0;

    googleSearchNavigator.navigate(eventEscapeKey, state);
    expect(state.pointerPosition).toEqual(-1);
  });

  it("should select search bar content when press escape key", () => {
    const state: GlobalState = new GlobalState();
    const searchBar: Element = getSearchBar();
    spyOn(<HTMLInputElement>searchBar, "select");

    googleSearchNavigator.navigate(eventEscapeKey, state);

    expect((<HTMLInputElement>searchBar).select).toHaveBeenCalled();
  });

  it("should scroll on top when press escape key", () => {
    const state: GlobalState = new GlobalState();
    googleSearchNavigator.navigate(eventEscapeKey, state);

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("should unhighlight current highlighted section when press escape key", () => {
    const state: GlobalState = getStateWithMockedBehaviorSections();
    state.pointerPosition = 1;

    document.getElementsByClassName("g")[1].classList.add(HIGHLIGHT_CLASSNAME);
    googleSearchNavigator.navigate(eventEscapeKey, state);

    expect(document.getElementsByClassName("g")[1].classList).not.toContain(
      HIGHLIGHT_CLASSNAME
    );
  });

  it("should restart navigation when tab pressed and searchBar selected", () => {
    const state: GlobalState = new GlobalState();
    state.linkSections = [dumbHtmlElement, dumbHtmlElement];

    googleSearchNavigator.navigate(eventTabKey, state);
    expect(state.pointerPosition).toEqual(0);
    expect(document.getElementsByClassName("toto")[0].classList).toContain(
      HIGHLIGHT_CLASSNAME
    );
  });

  it(`should not propagate event when ${TAB_KEY} is pressed`, () => {
    const state: GlobalState = new GlobalState();
    state.linkSections = [dumbHtmlElement, dumbHtmlElement];

    const event: KeyboardEvent = eventTabKey;

    spyOn(event, "preventDefault");
    googleSearchNavigator.navigate(event, state);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("should not highlight any section while browsing searchBar suggestions", () => {
    const state: GlobalState = new GlobalState();
    state.linkSections = [dumbHtmlElement, dumbHtmlElement];

    googleSearchNavigator.navigate(eventEscapeKey, state);
    googleSearchNavigator.navigate(eventArrowDownKey, state);

    expect(state.pointerPosition).toEqual(-1);
    expect(document.getElementsByClassName(HIGHLIGHT_CLASSNAME).length).toEqual(
      0
    );
  });

  it("should highlight again sections while not browsing searchBar suggestions anymore", () => {
    const state: GlobalState = new GlobalState();
    state.linkSections = [dumbHtmlElement, dumbHtmlElement];

    googleSearchNavigator.navigate(eventEscapeKey, state);
    googleSearchNavigator.navigate(eventTabKey, state);
    googleSearchNavigator.navigate(eventArrowDownKey, state);
    googleSearchNavigator.navigate(eventArrowDownKey, state);

    expect(state.pointerPosition).toEqual(1);
    expect(document.getElementsByClassName(HIGHLIGHT_CLASSNAME).length).toEqual(
      1
    );
  });
});

const getSearchBar = (): Element =>
  document.body.getElementsByClassName(SEARCH_BAR_CSS)[0];

const getStateWithMockedBehaviorSections = (): GlobalState => {
  const googleSearchParser: IGoogleSearchParser = new GoogleSearchParser(document);
  const state: GlobalState = new GlobalState();

  state.linkSections = googleSearchParser.getLinkSections();
  state.linkSections[0].scrollIntoView = jest.fn();
  state.linkSections[1].scrollIntoView = jest.fn();
  state.linkSections[2].scrollIntoView = jest.fn();

  return state;
};

