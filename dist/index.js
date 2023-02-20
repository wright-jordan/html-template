const lookup = {
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;",
    "<": "&lt;",
    ">": "&gt;",
};
export function html(strings, ...args) {
    let transformed = [];
    strings.forEach((s, i) => {
        const arg = args[i];
        if (!arg) {
            transformed.push(s);
            return;
        }
        transformed.push(s +
            arg.replace(/[&"'<>]/g, (ch) => lookup[ch]));
    });
    return transformed.join("");
}
