export const getElementById = (id: string): HTMLElement | null => {
    return document.querySelector(`#${id}`);
};

export const getElementsWithClasses = (tag: string, classes: string[]): NodeList => {
    const selector = `${tag}.${classes.join(".")}`;
    return document.querySelectorAll(selector);
};