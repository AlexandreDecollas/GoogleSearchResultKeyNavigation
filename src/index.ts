import IGoogleSearchParser from './google-search-parser/google-search-parser.interface';
import GoogleSearchParser from './google-search-parser/google-search-parser';

addEventListener("keydown", (_event: any) => {
    const googleSearchParser: IGoogleSearchParser = new GoogleSearchParser(document);
    const linkSections: any = googleSearchParser.getLinkSections();
    console.log('linkSections : ', linkSections);
});
