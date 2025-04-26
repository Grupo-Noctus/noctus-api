export function isEmailFromMatera (email: string): boolean {
    const permissionEmail: string = "matera";
    const regex: RegExp = new RegExp(`@${permissionEmail}`);
    return regex.test(email);
}