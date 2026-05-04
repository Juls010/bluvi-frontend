const MIN_AGE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const isValidIsoDate = (value: string) => {
    if (!MIN_AGE_REGEX.test(value)) return false;

    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
};

export const normalizeIsoDate = (value: string) => {
    const match = value.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (!match) return value;

    const [, year, month, day] = match;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

export const isAtLeastAge = (birthDateIso: string, minAge: number) => {
    const [year, month, day] = birthDateIso.split('-').map(Number);
    const today = new Date();

    let age = today.getFullYear() - year;
    const hasNotHadBirthdayThisYear =
        today.getMonth() + 1 < month ||
        (today.getMonth() + 1 === month && today.getDate() < day);

    if (hasNotHadBirthdayThisYear) {
        age -= 1;
    }

    return age >= minAge;
};
