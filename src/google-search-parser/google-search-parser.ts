import IGoogleSearchParser from "./google-search-parser.interface";
import {LINK_SECTION_CSS, LINK_SECTION_SELECTOR, RESULT_SECTION_ID,} from "../constants/global.constant";

export default class GoogleSearchParser implements IGoogleSearchParser {
  private _document: Document;
  private _linkSections: Element[];

  constructor(document: Document) {
    this._document = document;
    this._linkSections = this._parse(document);
  }

  public _parse(document: any): HTMLElement[] {
    const links: HTMLElement[] = [];
    const linksContainer: HTMLElement = document.getElementById(
      RESULT_SECTION_ID
    );

    linksContainer
      .querySelectorAll<HTMLElement>(LINK_SECTION_SELECTOR)
      .forEach((element: HTMLElement) => {
        if (GoogleSearchParser._sectionIsCleanLink(element, linksContainer)) {
          links.push(element);
        }
      });
    return links;
  }

  public getLinkSections(): Element[] {
    return this._linkSections;
  }

  private static _sectionIsCleanLink(
    element: HTMLElement,
    parent: HTMLElement
  ): boolean {
    const elementAttributesData: string = element.className;

    return (
      element.parentElement === parent &&
      elementAttributesData === LINK_SECTION_CSS
    );
  }
}
