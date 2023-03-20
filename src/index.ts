// TODO: Use a map instead of a plain object.
const lookup = {
  "&": "&amp;",
  '"': "&quot;",
  "'": "&apos;",
  "<": "&lt;",
  ">": "&gt;",
};

export function html(strings: string[], ...args: string[]) {
  let transformed: string[] = [];
  strings.forEach((s, i) => {
    const arg = args[i];
    if (!arg) {
      transformed.push(s);
      return;
    }
    transformed.push(
      s +
        arg.replace(
          /[&"'<>]/g,
          (ch) => lookup[ch as "&" | '"' | "'" | "<" | ">"]
        )
    );
  });
  return transformed.join("");
}
