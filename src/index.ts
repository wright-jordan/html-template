const lookup = new Map<string, string>([
  ["&", "&amp;"],
  ['"', "&quot;"],
  ["'", "&apos;"],
  ["<", "&lt;"],
  [">", "&gt;"],
]);

function replacer(ch: string): string {
  return lookup.get(ch)!;
}

export function html(strings: TemplateStringsArray, ...args: string[]) {
  let transformed = "";
  for (let i = 0; i < strings.length; i++) {
    const arg = args[i];
    if (arg) {
      transformed += strings[i] + arg.replace(/[&"'<>]/g, replacer);
    } else {
      transformed += strings[i];
    }
  }
  return transformed;
}
