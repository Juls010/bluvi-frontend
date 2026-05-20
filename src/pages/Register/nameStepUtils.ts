const PERSON_NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;

export const toTitleCase = (value: string) =>
    value.replace(/(^|\s)(\S)/g, (_, space, char) => space + char.toUpperCase());

export const sanitizeNameInput = (value: string) =>
    toTitleCase(
        value
            .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]/g, '')
            .replace(/\s{2,}/g, ' ')
            .slice(0, 80)
    );

export const isOnlyLettersAndSpaces = (value: string) => PERSON_NAME_REGEX.test(value.trim());
