import sanitizeHtml, { IOptions } from 'sanitize-html';

export class HtmlSanitizer {
  private options: sanitizeHtml.IOptions;

  constructor(options: IOptions) {
    this.options = options;
  }

  public sanitizeHtml(stringHtml: string) {
    return sanitizeHtml(stringHtml, this.options);
  }
}
