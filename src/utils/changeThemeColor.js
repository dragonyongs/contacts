export function changeThemeColor(color) {
    document
        .querySelector('meta[name="theme-color"]')
        .setAttribute("content", color);
}