import IGoogleSearchParser from "../../src/google-search-parser/google-search-parser.interface";
import GoogleSearchParser from "../../src/google-search-parser/google-search-parser";
import {
  LINK_SECTION_CSS,
  LINK_SECTION_SELECTOR,
  RESULT_SECTION_ID,
} from "../../src/constants/global.constant";
import Spy = jasmine.Spy;

describe("GoogleSearchParser", () => {
  let googleSearchParser: IGoogleSearchParser;
  let document: Document = new Document();

  it("should parse all clickable section of google search page at init", () => {
    let getElementByIdMock: Spy = spyOn(
      document,
      "getElementById"
    ).and.returnValue(document);
    const querySelectorAllMock: Spy = spyOn(
      document,
      "querySelectorAll"
    ).and.returnValue([]);

    googleSearchParser = new GoogleSearchParser(document);

    expect(getElementByIdMock).toHaveBeenCalledWith(RESULT_SECTION_ID);
    expect(querySelectorAllMock).toHaveBeenCalledWith(LINK_SECTION_SELECTOR);
  });

  it(`should filter element containing only ${LINK_SECTION_CSS} css class`, () => {
    spyOn(document, "getElementById").and.returnValue(document);
    spyOn(document, "querySelectorAll").and.returnValue([
      {
        className: "g",
        parentElement: document,
      },
      {
        className: "g toto",
        parentElement: document,
      },
      {
        className: "g tutu",
        parentElement: document,
      },
    ]);

    googleSearchParser = new GoogleSearchParser(document);
    expect(googleSearchParser.getLinkSections().length).toEqual(1);
  });

  it(`should add only children element containing ${LINK_SECTION_CSS} css class`, () => {
    spyOn(document, "getElementById").and.returnValue(document);
    spyOn(document, "querySelectorAll").and.returnValue([
      {
        className: "g",
        parentElement: document,
      },
      {
        className: "g toto",
        parentElement: document,
      },
      {
        className: "g",
        parentElement: null,
      },
    ]);

    googleSearchParser = new GoogleSearchParser(document);
    expect(googleSearchParser.getLinkSections().length).toEqual(1);
  });

  it(`should highlight link when link's id is pointer's id`, () => {

  });
});
