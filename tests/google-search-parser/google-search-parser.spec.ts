import IGoogleSearchParser from '../../src/google-search-parser/google-search-parser.interface';
import GoogleSearchParser from '../../src/google-search-parser/google-search-parser';
import {LINK_SECTION_CSS, LINK_SECTION_SELECTOR, RESULT_SECTION_ID} from '../../src/constants/global.constant';
import Spy = jasmine.Spy;

describe('GoogleSearchParser', () => {

    let googleSearchParser: IGoogleSearchParser;
    let document: Document = new Document();
    let getElementByIdMock: Spy;

    beforeAll(() => {
        // Object.defineProperty(global, 'document', {});
    });

    beforeEach(() => {
         getElementByIdMock = spyOn(document, 'getElementById').and.returnValue(document);

    });

    it('should parse all clickable section of google search page at init', () => {
        const querySelectorAllMock = spyOn(document, 'querySelectorAll').and.returnValue([]);

        googleSearchParser = new GoogleSearchParser(document);

        expect(getElementByIdMock).toHaveBeenCalledWith(RESULT_SECTION_ID);
        expect(querySelectorAllMock).toHaveBeenCalledWith(LINK_SECTION_SELECTOR);
    });

    it(`should filter element containing only ${LINK_SECTION_CSS} css class`, () => {
        spyOn(document, 'querySelectorAll').and.returnValue([
            {
                attributes: {
                    class: {
                        value: 'g'
                    }
                }
            },
            {
                attributes: {
                    class: {
                        value: 'g toto'
                    }
                }
            },
            {
                attributes: {
                    class: {
                        value: 'g tutu'
                    }
                }
            }
        ]);

        googleSearchParser = new GoogleSearchParser(document);
        expect(googleSearchParser.getLinkSections().length).toEqual(1);
    });


});
