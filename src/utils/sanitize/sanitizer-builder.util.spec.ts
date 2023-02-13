import { AllowedAttribute, IOptions } from 'sanitize-html';
import { HtmlSanitizerBuilder } from './sanitizer-builder.util';

describe('Sanitizer Options Builder', () => {
  let builder: HtmlSanitizerBuilder;

  beforeEach(() => {
    builder = new HtmlSanitizerBuilder();
  });

  it('should set to false allowedTags', () => {
    // when
    builder.allowAllTags();

    // then
    const builderOptions = getBuilderOptions();
    expect(builderOptions.allowedTags).toBeFalse();
  });

  it('should set to false allowedAttributes', () => {
    // when
    builder.allowAllAttributes();

    // then
    const builderOptions = getBuilderOptions();
    expect(builderOptions.allowedAttributes).toBeFalse();
  });

  it('should add new tags to allowedTags', () => {
    // when
    builder.allowTags(['tag1', 'tag2']);

    // then
    const builderOptions = getBuilderOptions();
    expect(builderOptions.allowedTags).toEqual(jasmine.arrayContaining(['tag1', 'tag2']));
  });

  it('should override allowedTags with new tags array', () => {
    // when
    builder.allowTags(['tag1', 'tag2'], true);

    // then
    const builderOptions = getBuilderOptions();
    expect(builderOptions.allowedTags).toEqual(['tag1', 'tag2']);
  });

  it('should add new tags to allowNonTextTags', () => {
    // when
    builder.allowNonTextTags(['tag1']);

    // then
    const builderOptions = getBuilderOptions();
    expect(builderOptions.nonTextTags).toContain('tag1');
  });

  it('should override allowNonTextTags with new tags array', () => {
    // when
    builder.allowNonTextTags(['tag1'], true);

    // then
    const builderOptions = getBuilderOptions();
    expect(builderOptions.nonTextTags).toEqual(['tag1']);
  });

  it('should add a new record to allowedAttributes with a specific key and a list of attribute names', () => {
    // when
    builder.allowAttributes(['data-*', 'attr1'], 'h1');

    // then
    const allowedAttributes = getBuilderAttributesOptions();
    expect(Object.keys(allowedAttributes).length).toBe(3);
    expect(Object.keys(allowedAttributes)).toContain('h1');
    expect(allowedAttributes.h1).toEqual(['data-*', 'attr1']);
  });

  it('should add a new record to allowedAttributes with * key in order to apply the list of attribute names for all tags', () => {
    // when
    builder.allowAttributes(['attr1']);

    // then
    const allowedAttributes = getBuilderAttributesOptions();
    expect(Object.keys(allowedAttributes).length).toBe(3);
    expect(Object.keys(allowedAttributes)).toContain('*');
    expect(allowedAttributes['*']).toEqual(['attr1']);
  });

  it('should override allowedAttributes and set only one record with * key and list of allowed attribute names', () => {
    // when
    builder.allowAttributes(['attr1'], undefined, true);

    // then
    const allowedAttributes = getBuilderAttributesOptions();
    expect(Object.keys(allowedAttributes).length).toBe(1);
    expect(Object.keys(allowedAttributes)).toContain('*');
    expect(allowedAttributes['*']).toEqual(['attr1']);
  });

  it('should add new record to allowedAttributes with details like the name of the attribute, values and multiple flag', () => {
    // given
    const allowedAttributeSingleValue: AllowedAttribute = { name: 'attr1', multiple: false, values: ['value1'] };
    const allowedAttributeMultipleValues: AllowedAttribute = {
      name: 'attr2',
      multiple: true,
      values: ['value1', 'value2'],
    };

    // when
    builder.allowAttributes([allowedAttributeSingleValue, allowedAttributeMultipleValues], 'tag1');

    // then
    const allowedAttributes = getBuilderAttributesOptions();
    expect(Object.keys(allowedAttributes).length).toBe(3);
    expect(Object.keys(allowedAttributes)).toContain('tag1');
    expect(allowedAttributes.tag1).toEqual([allowedAttributeSingleValue, allowedAttributeMultipleValues]);
  });

  it('should set a specific css classes for a particular tag by adding to allowSpecificCssClasses', () => {
    // when
    builder.allowCssClasses(['class1', 'class2'], 'tag1');

    // then
    expect(Object.keys(getBuilderOptions().allowedClasses || {})).toContain('tag1');
    expect(getBuilderOptions().allowedClasses?.tag1).toEqual(['class1', 'class2']);
  });

  it('should add iframe tag to allowed tags, allow the src attribute and set allowed domains and hostnames', () => {
    // when
    builder.setIframeFilters(['domain.de'], ['www.domain.de']);

    // then
    const builderOptions = getBuilderOptions();
    expect(builderOptions.allowedTags).toContain('iframe');
    expect(builderOptions.allowedIframeDomains).toEqual(['domain.de']);
    expect(builderOptions.allowedIframeHostnames).toEqual(['www.domain.de']);
  });

  it('should set allowedSchemas by adding new url schemes for attributes like href or src', () => {
    // when
    builder.allowUrlSchemes(['data']);

    // then
    const builderOptions = getBuilderOptions();
    expect(builderOptions.allowedSchemes).toContain('data');
  });

  it('should set allowedSchemesByTag by adding new url schemes for a specific element which has allowed attributes like href or src', () => {
    // when
    builder.allowUrlSchemesForTag(['data'], 'img');

    // then
    const builderOptions = getBuilderOptions();
    expect(builderOptions.allowedSchemesByTag as any).toEqual({ img: ['data'] });
  });

  it('should allow scripts by adding script tag to allowedTags and src to allowedAttributes for script element and setting allowed domains and hostnames', () => {
    // when
    builder.allowScripts(['domain.de'], ['www.domain.de']);

    // then
    const allowedAttributes = getBuilderAttributesOptions();
    const builderOptions = getBuilderOptions();

    expect(builderOptions.allowedTags).toContain('script');
    expect(Object.keys(allowedAttributes)).toContain('script');
    expect(allowedAttributes.script).toEqual(['src']);
    expect(builderOptions.allowedScriptDomains).toEqual(['domain.de']);
    expect(builderOptions.allowedScriptHostnames).toEqual(['www.domain.de']);
  });

  it('should set enforceHtmlBoundary flag', () => {
    // when
    builder.allowTextOutsideOfHtml(true);

    // then
    const builderOptions = getBuilderOptions();
    expect(builderOptions.enforceHtmlBoundary).toBeTrue();
  });

  it('should set allowVulnerableTags flag', () => {
    // when
    builder.disableWarningForVulnerableTags(true);

    // then
    const builderOptions = getBuilderOptions();
    expect(builderOptions.allowVulnerableTags).toBeTrue();
  });

  const getBuilderOptions = (): IOptions => {
    return (builder as any).options as IOptions;
  };

  const getBuilderAttributesOptions = (): Record<string, AllowedAttribute[]> => {
    return getBuilderOptions().allowedAttributes as Record<string, AllowedAttribute[]>;
  };
});
