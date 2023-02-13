import { AllowedAttribute } from 'sanitize-html';
import { HtmlSanitizerBuilder } from './sanitizer-builder.util';
import { HtmlSanitizer } from './sanitizer.util';

export interface IHtmlSanitizerBuilder {
  /**
   * Allow all tags by not discarding or escaping.
   * @example
   * ```ts
   *  new HtmlSanitizerBuilder().allowAllTags().build();
   * ```
   * @returns Builder instance
   */
  allowAllTags(): HtmlSanitizerBuilder;

  /**
   * Allow all attributes for all allowed tags by not discarding or escaping.
   * @example
   * ```ts
   *  new HtmlSanitizerBuilder().allowAllAttributes().build();
   * ```
   * @returns Builder instance
   */
  allowAllAttributes(): HtmlSanitizerBuilder;

  /**
   * Append or override to/the existing list of allowed tags.
   * Only the tags which are included will not be discarded.
   *
   * #### Important: if the tag is not allowed, the inner tags (if are allowed) and the text content will be preserved.
   *
   * @example Appending to existing list
   *  ```ts
   *  const sanitizer = new HtmlSanitizerBuilder()
   *     .allowTags(['new-tag-one'])
   *     .build();
   *  sanitizer.sanitizeHtml('<div><new-tag-one></new-tag-one><unknown-tag></unknown-tag></div>');
   * ```
   *
   * ### result
   * The unknown-tag was discarded
   * ```
   * <div>
   *    <new-tag-one></new-tag-one>
   * </div>
   * ```
   *
   * @example Override the existing list
   *  ```ts
   *  new HtmlSanitizerBuilder()
   *    .allowTags(['new-tag-one'], true)
   *    .build();
   *  sanitizer.sanitizeHtml('<div>Some text<new-tag-one></new-tag-one><unknown-tag></unknown-tag></div>');
   * ```
   * ###result
   * The div tag was discarded because we override the default list of allowedTags; also the unknown-tag is discarded.
   * Only the text content and tags which are allowed will not be discarded
   * ```
   * Some text
   * <new-tag-one></new-tag-one>
   * ```
   *
   * @param allowedTags
   * @param override default is ```false```
   * @returns Builder instance
   */
  allowTags(allowedTags: string[], override: boolean): HtmlSanitizerBuilder;

  /**
   * Set a list of allowed attributes for specific tag if ```tagName``` parameter was specified otherwise will apply for all tags.
   * Make sure that specified tag on ```tagName``` was included into allowedTags list.
   *
   * @example
   * with array of attribute names.
   * You can use the ```*``` wildcard to allow all attributes with a certain prefix.
   * ### usage
   * ```ts
   *  const sanitizer = new HtmlSanitizerBuilder()
   *    .allowAttributes(['href', 'data-*'], 'a')
   *    .build();
   *
   *  sanitizer.sanitizeHtml('<a href="https://some-link.com" data-id="linkId" data-name="link name" not-allowed-attr="something">Click</a>');
   * ```
   *
   * ### result
   * Only the unknown attribute was discarded
   * ```
   * <a href="https://some-link.com" data-id="linkId" data-name="link name">Click</a>
   * ```
   *
   * @example
   * with array of AllowedAttribute
   * ### usage
   * ```ts
   *  const sanitizer = new HtmlSanitizerBuilder()
   *    .allowAttributes(
   *        [
   *            {
   *                name: 'href',
   *                multiple: true,
   *                values: ['https://trusted-link.com']
   *            }
   *        ], 'a')
   *    .build();
   *
   *  const cleanHtml = sanitizer.sanitizeHtml('<a href="https://trusted-link.com">Click</a>');
   *  const dirtyHtml = sanitizer.sanitizeHtml('<a href="https://untrasted-link.com" not-allowed-attr="something">Click</a>');
   * ```
   *
   * ### results
   * #### cleanHtml
   * The href attribute is allowed and has allowed value
   * ```
   * <a href="https://trusted-link.com">Click</a>
   * ```
   *
   * #### dirtyHtml
   * The href attribute is allowed but doesn't have allowed value; also not-allowed-attr was dropped
   * ```
   * <a>Click</a>
   * ```
   * @param allowedAttributes
   * @param tagName default value ```*``` ; when it is not specified will apply for all tags;
   * @param override default is ```false```
   * @returns Builder instance
   */
  allowAttributes(allowedAttributes: AllowedAttribute[], tagName: string, override: boolean): HtmlSanitizerBuilder;

  /**
   * If a tag is not allowed, all of the text within it is preserved (see ```allowedTags``` method), and so are any allowed tags within it.
   * Exceptions are: style, script, textarea, option
   *
   * @example
   * ```
   * const sanitizer = new HtmlSanitizerBuilder()
   *     .allowTags(['h1'], true) // override the allowed tags only with h1 tag
   *     .allowNonTextTags(['div']) // content will be discarded from div elements
   *     .build();
   * sanitizer.sanitizeHtml('<div><h1>Some content</h1></div>');
   * ```
   *
   * ### result
   * We will have empty content because ```div``` tag is not in allowedTags, but was added in nonTextTags.
   * Even if ```h1``` tag is allowed tag will be discarded since it is inner content of ```div```.
   * ```
   * <!-- Empty content -->
   * ```
   * @param nonTextTags default ['style', 'script', 'option', 'textarea'] also these tags are not included into allowedTags list
   * @param override default is ```false````
   * @returns Builder instance
   */
  allowNonTextTags(nonTextTags: string[], override: boolean): HtmlSanitizerBuilder;

  /**
   * #### Important: if ```class``` attribute was allowed this feature will be ignored
   *
   * Set a list of css classes which are allowed for a tag.
   * If the tag was not specified will apply for all allowed tags.
   *
   * @example
   *
   * ```
   * const sanitizer = new HtmlSanitizerBuilder()
   *    .allowCssClasses(['row', 'col-*'])
   *    .build();
   *
   * sanitizer.sanitizeHtml('<div class="row"><div class="col-md-12 unknown-class">col</div></div>');
   * ```
   * ### result
   * ```
   * <div class="row">
   *    <div class="col-md-12">
   *        col
   *    </div>
   * </div>
   * ```
   *
   * @param cssClasses class names or regex
   * @param tagName default value ```*``` ; when it is not specified will apply for all tags;
   * @returns Builder instance
   */
  allowCssClasses(cssClasses: string[], tagName: string): HtmlSanitizerBuilder;

  /**
   * By using this option builder method, automatically add iframe tag in allowedTags list.
   * Allow iframe elements which have specified hostnames or/and domains
   *
   * @param allowedIFrameDomains default empty list
   * @param allowedIFrameHostNames default empty list
   * @returns Builder instance
   */
  setIframeFilters(allowedIFrameDomains: string[], allowedIFrameHostNames: string[]): HtmlSanitizerBuilder;

  /**
   * Add new urls schemes for the allowed tags which also support attributes like src, href, etc.
   * Default allowedSchemes: [ 'http', 'https', 'ftp', 'mailto', 'tel' ],
   *
   * @param urlSchemes
   * @param override default is ```false````
   * @returns Builder instance
   */
  allowUrlSchemes(urlSchemes: string[], override: boolean): HtmlSanitizerBuilder;

  /**
   * Allow url schemes for a tag which is allowed. Make sure that allowed tag list contains the tag.
   * By default these schemes are applied for allowed attributes like href, src, etc for specified tag.
   *
   * @param urlSchemes
   * @param tagName
   * @returns Builder instance
   */
  allowUrlSchemesForTag(urlSchemes: string[], tagName: string): HtmlSanitizerBuilder;

  /**
   * By using this option builder method, automatically add script tag in allowedTags list.
   * Allow script elements which have specified hostnames or/and domains.
   *
   * @param allowedScriptDomains
   * @param allowedScriptHostnames
   * @returns Builder instance
   */
  allowScripts(allowedScriptDomains: string[], allowedScriptHostnames: string[]): HtmlSanitizerBuilder;

  /**
   * Setting this option to true will instruct sanitizer to discard all characters outside of html tag boundaries
   * before <html> and after </html> tags.
   *
   * @param flag
   * @returns Builder instance
   */
  allowTextOutsideOfHtml(flag: boolean): HtmlSanitizerBuilder;

  /**
   * Disable warning when xss vulnerable tags like script or style are allowed.
   *
   * @param flag
   * @returns Builder instance
   */
  disableWarningForVulnerableTags(flag: boolean): HtmlSanitizerBuilder;

  /**
   * @returns an instance of ```HtmlSanitizer```
   */
  build(): HtmlSanitizer;
}
