import IGoogleSearchParser from "./google-search-parser/google-search-parser.interface";
import GoogleSearchParser from "./google-search-parser/google-search-parser";
import GlobalState from "./constants/global-state";
import isEmpty from "lodash/isEmpty";

const state: GlobalState = new GlobalState();

addEventListener("keydown", (event: KeyboardEvent) => {
  if (isEmpty(state.linkSections)) {
      const googleSearchParser: IGoogleSearchParser = new GoogleSearchParser(
        document
      );
      state.linkSections = googleSearchParser.getLinkSections();
  }

  if (state.pointerPosition > -1) {
    state.linkSections[state.pointerPosition].style.background = "";
  }

  switch (event.key) {
    case "ArrowDown":
      state.pointerPosition++;
      event.preventDefault();
      break;
    case "ArrowUp":
      state.pointerPosition--;
      event.preventDefault();
      break;
    case "Escape":
      // selectSearchBox();
      // event.preventDefault();
      break;
    default:
      break;
  }
  // links[focusedLinkId].querySelector('a').focus(); };
  console.log("state.pointerPosition : ", state.pointerPosition);
  console.log(
    "linkSections[state.pointerPosition] : ",
    state.linkSections[state.pointerPosition]
  );
  state.linkSections[state.pointerPosition].style.background = "grey";
  state.linkSections[state.pointerPosition].scrollIntoView(false);
});
