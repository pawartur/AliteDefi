export const toHex = (num: any) => {
    const val = Number(num);
    return "0x" + val.toString(16);
};