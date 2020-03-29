import IGoogleSearchParser from './google-search-parser.interface';
import {
    CLASS_PROPERTY_NAME,
    LINK_SECTION_CSS,
    LINK_SECTION_SELECTOR,
    RESULT_SECTION_ID, VALUE_PROPERTY_NAME
} from '../constants/global.constant';

export default class GoogleSearchParser implements IGoogleSearchParser {
    private _document: Document;
    private _linkSections: HTMLElement[];

    constructor(document: Document) {
        this._document = document;
        this._linkSections = this._parse(document);
    }

    public _parse(document: any): HTMLElement[] {
        const links: HTMLElement[] = [];
        document
            .getElementById(RESULT_SECTION_ID)
            .querySelectorAll(LINK_SECTION_SELECTOR)
            .forEach((element: HTMLElement) => {
                // @ts-ignore
                const elementClasses: string = element.attributes[CLASS_PROPERTY_NAME][VALUE_PROPERTY_NAME];

                if (elementClasses === LINK_SECTION_CSS) {
                     links.push(element);
                }
            });
        return links;
    }

    public getLinkSections(): HTMLElement[] {
        return this._linkSections;
    }
}
