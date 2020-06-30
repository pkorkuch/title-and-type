export abstract class SourceDocument {
    rawContents: string;
    documentBody: string;
    renderedHTML: string;
    metadata: object;

    constructor(contents: string) {
        this.rawContents = contents;
        this.metadata = this.extractMetadata();
        this.documentBody = this.extractBody();
        this.renderedHTML = this.render();
    }

    protected abstract render(): string;
    protected abstract extractMetadata(): object;
    protected abstract extractBody(): string;
}