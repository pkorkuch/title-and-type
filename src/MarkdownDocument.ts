import { SourceDocument } from './SourceDocument';

import md from 'marked';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

import fm, { FrontMatterResult } from 'front-matter';

const window = new JSDOM('').window;
const purify = createDOMPurify(window);

export class MarkdownDocument extends SourceDocument {
    private fmResult: FrontMatterResult<object>;
    
    constructor(contents: string) {
        super(contents);
        this.fmResult = fm(contents);
    }

    protected render(): string {
        if (this.documentBody) {
            const renderedHtml = md(this.documentBody);
            return purify.sanitize(renderedHtml, null);
        } else {
            return '';
        }
    }

    protected extractMetadata(): object {
        return this.fmResult.attributes;
    }

    protected extractBody(): string {
        return this.fmResult.body;
    }
}