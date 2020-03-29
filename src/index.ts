import IGoogleSearchParser from "./google-search-parser/google-search-parser.interface";
import GoogleSearchParser from "./google-search-parser/google-search-parser";
import IGlobalState from "./constants/global-state";

const state: IGlobalState = {
  pointerPosition: -1,
};

addEventListener("keydown", (event: any) => {
  const googleSearchParser: IGoogleSearchParser = new GoogleSearchParser(
    document
  );
  const linkSections: HTMLElement[] = googleSearchParser.getLinkSections();
  console.log("linkSections : ", linkSections);

  if (state.pointerPosition > -1) {
    linkSections[state.pointerPosition].style.background = "";
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
    linkSections[state.pointerPosition]
  );
  linkSections[state.pointerPosition].style.background = "grey";
  linkSections[state.pointerPosition].scrollIntoView(false);
});
