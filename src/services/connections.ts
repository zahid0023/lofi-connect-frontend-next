const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const initGhlConnection = (appKeyId: number): void => {
    window.location.href = `${BASE_URL}/authorization/ghl/init?app-key-id=${appKeyId}`;
};
