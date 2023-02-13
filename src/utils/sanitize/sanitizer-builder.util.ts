import sanitizeHtml, { AllowedAttribute, DisallowedTagsModes, IOptions } from 'sanitize-html';
import { IHtmlSanitizerBuilder } from './models';
import { HtmlSanitizer } from './sanitizer.util';

/**
 * You can find the default options here {@link https://github.com/apostrophecms/sanitize-html#default-options}
 */
export class HtmlSanitizerBuilder implements IHtmlSanitizerBuilder {
  private options: IOptions = { ...sanitizeHtml.defaults };

  constructor(disallowedTagsMode: DisallowedTagsModes = 'discard') {
    this.options = {
      ...this.options,
      disallowedTagsMode,
      nonTextTags: ['style', 'script', 'option', 'textarea'],
    };
  }

  allowAllTags(): HtmlSanitizerBuilder {
    this.options = { ...this.options, allowedTags: false };
    return this;
  }

  allowAllAttributes(): HtmlSanitizerBuilder {
    this.options = { ...this.options, allowedAttributes: false };
    return this;
  }

  allowTags(allowedTags: string[], override = false): HtmlSanitizerBuilder {
    // if overrides or allowedTags was set to false by allowAllTags method
    if (override || !this.options.allowedAttributes) {
      this.options = { ...this.options, allowedTags: [...allowedTags] };
      return this;
    }
    this.options = {
      ...this.options,
      allowedTags: [...new Set([...(this.options.allowedTags || []), ...allowedTags])],
    };
    return this;
  }

  allowAttributes(allowedAttributes: AllowedAttribute[], tagName = '*', override = false): HtmlSanitizerBuilder {
    // if overrides or allowedAttributes was set to false by allowAllAttributes method
    if (override || !this.options.allowedAttributes) {
      this.options = { ...this.options, allowedAttributes: { [tagName]: allowedAttributes } };
      return this;
    }
    const tagAllowedAttributes = (this.options.allowedAttributes as Record<string, AllowedAttribute[]>)[tagName] || [];
    this.options.allowedAttributes = {
      ...this.options.allowedAttributes,
      [tagName]: [...tagAllowedAttributes, ...allowedAttributes],
    };
    return this;
  }

  allowNonTextTags(nonTextTags: string[], override = false): HtmlSanitizerBuilder {
    const allowedNonTextTags = override
      ? [...nonTextTags]
      : [...new Set([...(this.options.nonTextTags || []), ...nonTextTags])];
    this.options = { ...this.options, nonTextTags: allowedNonTextTags };
    return this;
  }

  allowCssClasses(cssClasses: string[], tagName = '*'): HtmlSanitizerBuilder {
    this.options.allowedClasses = {
      ...this.options.allowedClasses,
      [tagName]: [...cssClasses],
    };
    return this;
  }

  setIframeFilters(
    allowedIFrameDomains: string[] = [],
    allowedIFrameHostNames: string[] = []
  ): HtmlSanitizerBuilder {
    this.options.allowedIframeDomains = [...allowedIFrameDomains];
    this.options.allowedIframeHostnames = [...allowedIFrameHostNames];
    return this.allowTags(['iframe']).allowAttributes(['src'], 'iframe');
  }

  allowUrlSchemes(urlSchemes: string[], override = false): HtmlSanitizerBuilder {
    this.options.allowedSchemes = override
      ? [...urlSchemes]
      : [...(this.options.allowedSchemes as string[]), ...urlSchemes];
    return this;
  }

  allowUrlSchemesForTag(urlSchemes: string[], tagName: string): HtmlSanitizerBuilder {
    let allowedSchemesByTag;
    if (this.options.allowedSchemesByTag && typeof this.options.allowedSchemesByTag !== 'boolean') {
      allowedSchemesByTag = { ...this.options.allowedSchemesByTag, [tagName]: [...urlSchemes] };
    } else {
      allowedSchemesByTag = { [tagName]: [...urlSchemes] };
    }
    this.options = { ...this.options, allowedSchemesByTag };
    return this;
  }

  allowScripts(allowedScriptDomains: string[] = [], allowedScriptHostnames: string[] = []): HtmlSanitizerBuilder {
    this.options = {
      ...this.options,
      allowedScriptDomains: [...allowedScriptDomains],
      allowedScriptHostnames: [...allowedScriptHostnames],
    };
    return this.allowTags(['script']).allowAttributes(['src'], 'script');
  }

  allowTextOutsideOfHtml(flag: boolean): HtmlSanitizerBuilder {
    this.options = { ...this.options, enforceHtmlBoundary: flag };
    return this;
  }

  disableWarningForVulnerableTags(flag: boolean): HtmlSanitizerBuilder {
    this.options = { ...this.options, allowVulnerableTags: flag };
    return this;
  }

  build(): HtmlSanitizer {
    return new HtmlSanitizer(this.options);
  }
}
