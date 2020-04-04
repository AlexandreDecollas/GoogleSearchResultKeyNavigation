import IGoogleSearchParser from "./google-search-parser/google-search-parser.interface";
import GoogleSearchParser from "./google-search-parser/google-search-parser";
import GlobalState from "./constants/global-state";
import isEmpty from "lodash/isEmpty";
import IGoogleSearchNavigator from './google-search-navigator/google-search-navigator.interface';
import GoogleSearchNavigator from './google-search-navigator/google-search-navigator';

const state: GlobalState = new GlobalState();

addEventListener("keydown", (event: KeyboardEvent) => {
  if (isEmpty(state.linkSections)) {
      const googleSearchParser: IGoogleSearchParser = new GoogleSearchParser(
        document
      );
      state.linkSections = googleSearchParser.getLinkSections();
  }

  const googleSearchNavigator: IGoogleSearchNavigator = new GoogleSearchNavigator();

  googleSearchNavigator.navigate(event, state);
});
