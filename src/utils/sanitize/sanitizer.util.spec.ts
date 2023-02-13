import { HtmlSanitizerBuilder } from './sanitizer-builder.util';

describe('Sanitizer', () => {
  it('should return the string when the content does not contains vulnerabilities', () => {
    // given
    const htmlSanitizer = new HtmlSanitizerBuilder().build();
    const safeHtml = '<h1>hello world</h1>';

    // when
    const sanitizedHtml = htmlSanitizer.sanitizeHtml(safeHtml);

    // then
    expect(sanitizedHtml).toBe(safeHtml);
  });

  it('should escape the disallowed tags', () => {
    // given
    const htmlSanitizer = new HtmlSanitizerBuilder('escape').build();
    let dirtyHtml = '<div>';
    dirtyHtml += '<h1>Safe title</h1>';
    dirtyHtml += '<new-tag></new-tag>';
    dirtyHtml += '<img href="https://xss-attack.com"/>';
    dirtyHtml += '</div>';

    // when
    const sanitizedHtml = htmlSanitizer.sanitizeHtml(dirtyHtml);

    // then
    expect(sanitizedHtml).toBe('<div><h1>Safe title</h1>&lt;new-tag&gt;&lt;/new-tag&gt;&lt;img /&gt;</div>');
  });

  describe('nonTextTags', () => {
    it('should discard the innerHTML from tags which are included in nonTextTags and are not included in allowedTags', () => {
      // given
      const htmlSanitizer = new HtmlSanitizerBuilder()
        .allowTags(['h1'], true) // override the allowed tags only with h1 tag
        .allowNonTextTags(['div']) // content will be discarded from div elements
        .build();
      const dirtyHtml = '<div><h1>Some content</h1></div>';

      // when
      const sanitizedHtml = htmlSanitizer.sanitizeHtml(dirtyHtml);

      // then
      expect(sanitizedHtml).toBe('');
    });
  });

  describe('Tags', () => {
    it('should allow all tags', () => {
      // given
      const htmlSanitizer = new HtmlSanitizerBuilder().allowAllTags().build();
      let dirtyHtml = '<div>';
      dirtyHtml += '<h1>Safe title</h1>';
      dirtyHtml += '<new-tag></new-tag>';
      dirtyHtml += '<img/>';
      dirtyHtml += '</div>';

      // when
      const sanitizedHtml = htmlSanitizer.sanitizeHtml(dirtyHtml);

      // then
      expect(sanitizedHtml).toBe('<div><h1>Safe title</h1><new-tag></new-tag><img /></div>');
    });

    it('should drop img tag since it was not included into allowed tags', () => {
      // given
      const htmlSanitizer = new HtmlSanitizerBuilder().build();
      let dirtyHtml = '<div>';
      dirtyHtml += '<h1>Safe title</h1>';
      dirtyHtml += '<img href="injected script" onerror=alert("img") />';
      dirtyHtml += '</div>';

      // when
      const sanitizedHtml = htmlSanitizer.sanitizeHtml(dirtyHtml);

      // then
      expect(sanitizedHtml).toBe('<div><h1>Safe title</h1></div>');
    });

    it('should allow img tag when it was specified on allowed tag list and dropping not allowed attributes like onerror', () => {
      // given
      const htmlSanitizer = new HtmlSanitizerBuilder().allowTags(['img']).build();
      let dirtyHtml = '<div>';
      dirtyHtml += '<h1>Safe title</h1>';
      dirtyHtml += '<img src="http://some-url.de" onerror=alert("img") />';
      dirtyHtml += '</div>';

      // when
      const sanitizedHtml = htmlSanitizer.sanitizeHtml(dirtyHtml);

      // then
      expect(sanitizedHtml).toBe('<div><h1>Safe title</h1><img src="http://some-url.de" /></div>');
    });

    it('should preserve the text inside tags that are not allowed', () => {
      // given
      const htmlSanitizer = new HtmlSanitizerBuilder().allowTags([], true).build();
      const dirtyHtml = '<h1>Safe title</h1>';

      // when
      const sanitizedHtml = htmlSanitizer.sanitizeHtml(dirtyHtml);

      // then
      expect(sanitizedHtml).toBe('Safe title');
    });
  });

  describe('Attributes', () => {
    it('should allow link tag with default attributes and drop the other attributes', () => {
      // given
      const htmlSanitizer = new HtmlSanitizerBuilder().build();
      let dirtyHtml = '<div>';
      dirtyHtml += '<h1>Safe title</h1>';
      dirtyHtml += '<a href="https://some-link.com" data-id="image-id data-name="image name"></a>';
      dirtyHtml += '</div>';

      // when
      const sanitizedHtml = htmlSanitizer.sanitizeHtml(dirtyHtml);

      // then
      expect(sanitizedHtml).toBe('<div><h1>Safe title</h1><a href="https://some-link.com"></a></div>');
    });

    it('should allow img tag and attributes by name and wild cards', () => {
      // given
      const htmlSanitizer = new HtmlSanitizerBuilder()
        .allowTags(['img'])
        .allowAttributes(['href', 'data-*'], 'img')
        .build();
      let dirtyHtml = '<div>';
      dirtyHtml += '<h1>Safe title</h1>';
      dirtyHtml += '<img href="https://someImage.com" onerror=alert("img") data-id="image-id data-name="image name"/>';
      dirtyHtml += '</div>';

      // when
      const sanitizedHtml = htmlSanitizer.sanitizeHtml(dirtyHtml);

      // then
      expect(sanitizedHtml).toBe(
        '<div><h1>Safe title</h1><img href="https://someImage.com" data-id="image-id data-name=" /></div>'
      );
    });

    it('should allow specific attribute with specific values', () => {
      // given
      const htmlSanitizer = new HtmlSanitizerBuilder()
        .allowTags(['img'])
        .allowAttributes([{ name: 'href', multiple: true, values: ['https://allowed-domain.com'] }], 'img')
        .build();
      let dirtyHtml = '<div>';
      dirtyHtml += '<h1>Safe title</h1>';
      dirtyHtml += '<img href="https://allowed-domain.com" />';
      dirtyHtml += '</div>';

      // when
      const sanitizedHtml = htmlSanitizer.sanitizeHtml(dirtyHtml);

      // then
      expect(sanitizedHtml).toBe('<div><h1>Safe title</h1><img href="https://allowed-domain.com" /></div>');
    });
  });

  describe('CSS classes', () => {
    it('should allow any css classes when class attribute was specified on allowed attributes list', () => {
      // given
      const htmlSanitizer = new HtmlSanitizerBuilder().allowAttributes(['class']).build();
      const dirtyHtml = '<div class="any-class"></div>';

      // when
      const sanitizedHtml = htmlSanitizer.sanitizeHtml(dirtyHtml);

      // then
      expect(sanitizedHtml).toBe('<div class="any-class"></div>');
    });

    it('should allow only specific css classes and sanitize the others for all allowed tags', () => {
      // given
      const htmlSanitizer = new HtmlSanitizerBuilder().allowCssClasses(['row', 'col-*']).build();
      let dirtyHtml = '<div class="row">';
      dirtyHtml += '<div class="col-md-12 unknown-class">col</div>';
      dirtyHtml += '</div>';

      // when
      const sanitizedHtml = htmlSanitizer.sanitizeHtml(dirtyHtml);

      // then
      expect(sanitizedHtml).toBe('<div class="row"><div class="col-md-12">col</div></div>');
    });
  });

  describe('iframe', () => {
    let dirtyHtmlTest = '<div><p>Allowed Iframe';
    dirtyHtmlTest += '<iframe src="https://www.domain.de/base-path/123"></iframe>';
    dirtyHtmlTest += '</p></div>';

    it('should allow iframe for specific hostname', () => {
      // given
      const htmlSanitizer = new HtmlSanitizerBuilder().setIframeFilters([], ['www.domain.de']).build();

      // when
      const sanitizedHtml = htmlSanitizer.sanitizeHtml(dirtyHtmlTest);

      // then
      expect(sanitizedHtml).toBe(
        '<div><p>Allowed Iframe<iframe src="https://www.domain.de/base-path/123"></iframe></p></div>'
      );
    });

    it('should sanitize iframe for unknown hostname and return empty iframe tag', () => {
      // given
      const htmlSanitizer = new HtmlSanitizerBuilder().setIframeFilters([], ['www.new-domain.de']).build();

      // when
      const sanitizedHtml = htmlSanitizer.sanitizeHtml(dirtyHtmlTest);

      // then
      expect(sanitizedHtml).toBe('<div><p>Allowed Iframe<iframe></iframe></p></div>');
    });

    it('should allow iframe for specific domain', () => {
      // given
      const htmlSanitizer = new HtmlSanitizerBuilder().setIframeFilters(['domain.de']).build();

      // when
      const sanitizedHtml = htmlSanitizer.sanitizeHtml(dirtyHtmlTest);

      // then
      expect(sanitizedHtml).toBe(
        '<div><p>Allowed Iframe<iframe src="https://www.domain.de/base-path/123"></iframe></p></div>'
      );
    });
  });

  describe('URL schemes', () => {
    let dirtyHtmlTest = '<div>';
    dirtyHtmlTest += '<h1>Safe title</h1>';
    dirtyHtmlTest += '<img src="data:image/png;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />';
    dirtyHtmlTest += '</div>';

    it('should sanitize src attribute by dropping it for img tag when url scheme is data', () => {
      // given
      const htmlSanitizer = new HtmlSanitizerBuilder().allowTags(['img']).build();

      // when
      const sanitizedHtml = htmlSanitizer.sanitizeHtml(dirtyHtmlTest);

      // then
      expect(sanitizedHtml).toBe('<div><h1>Safe title</h1><img /></div>');
    });

    it('should allow src attribute with data url scheme for img tag when these where specified as allowed', () => {
      // given
      const htmlSanitizer = new HtmlSanitizerBuilder()
        .allowTags(['img'])
        .allowUrlSchemesForTag(['data'], 'img')
        .build();

      // when
      const sanitizedHtml = htmlSanitizer.sanitizeHtml(dirtyHtmlTest);

      // then
      expect(sanitizedHtml).toBe(
        '<div><h1>Safe title</h1><img src="data:image/png;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /></div>'
      );
    });
  });

  describe('Script', () => {
    const dirtyHtmlTest = '<script src="https://www.safe.authorized.com/lib.js"></script>';

    it('should remove script tag if they are not allowed', () => {
      // given
      const htmlSanitizer = new HtmlSanitizerBuilder().build();

      // when
      const sanitizedHtml = htmlSanitizer.sanitizeHtml(dirtyHtmlTest);

      // then
      expect(sanitizedHtml).toBe('');
    });

    it('should allow a script tag when source is in the list of allowlisted domains', () => {
      // given
      const htmlSanitizer = new HtmlSanitizerBuilder()
        .disableWarningForVulnerableTags(true)
        .allowScripts(['authorized.com'])
        .build();

      // when
      const sanitizedHtml = htmlSanitizer.sanitizeHtml(dirtyHtmlTest);

      // then
      expect(sanitizedHtml).toBe('<script src="https://www.safe.authorized.com/lib.js"></script>');
    });

    it('should allow a script tag when source is in the list of allowlisted hostnames', () => {
      // given
      const htmlSanitizer = new HtmlSanitizerBuilder()
        .disableWarningForVulnerableTags(true)
        .allowScripts([], ['www.safe.authorized.com'])
        .build();

      // when
      const sanitizedHtml = htmlSanitizer.sanitizeHtml(dirtyHtmlTest);

      // then
      expect(sanitizedHtml).toBe('<script src="https://www.safe.authorized.com/lib.js"></script>');
    });
  });
});
