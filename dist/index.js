const lookup = new Map([
    ["&", "&amp;"],
    ['"', "&quot;"],
    ["'", "&apos;"],
    ["<", "&lt;"],
    [">", "&gt;"],
]);
function replacer(ch) {
    return lookup.get(ch);
}
export function html(strings, ...args) {
    let transformed = "";
    for (let i = 0; i < strings.length; i++) {
        const arg = args[i];
        if (arg) {
            transformed += strings[i] + arg.replace(/[&"'<>]/g, replacer);
        }
        else {
            transformed += strings[i];
        }
    }
    return transformed;
}
