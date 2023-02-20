import path from "path";
import fs from "fs/promises";
import { createHash } from "crypto";
async function getFilePaths(dir) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const promises = [];
    for (let i = 0; i < dirents.length; i++) {
        const dirent = dirents[i];
        const direntPath = path.resolve(dir, dirent.name);
        promises.push(dirent.isDirectory()
            ? getFilePaths(direntPath)
            : Promise.resolve(direntPath));
    }
    return (await Promise.all(promises)).flat();
    // const paths: (string | string[])[] = await Promise.all(
    //   dirents.map((dirent) => {
    //     const res = path.resolve(dir, dirent.name);
    //     return dirent.isDirectory() ? getFilePaths(res) : res;
    //   })
    // );
    // return paths.flat();
}
async function generateFileHash(fileName) {
    const buf = await fs.readFile(fileName);
    const hash = createHash("sha256").update(buf).digest("base64url");
    const newPath = fileName.replace(/\.[^(html)]+$/, (ext) => {
        return `.${hash}${ext}`;
    });
    return newPath;
}
async function hashFileNames(paths) {
    const oldPaths = [];
    const promises = [];
    for (let i = 0; i < paths.length; i++) {
        oldPaths.push(paths[i]);
        if (!/\.html$/.test(paths[i])) {
            promises.push(generateFileHash(paths[i]));
        }
        else {
            promises.push(Promise.resolve(paths[i]));
        }
    }
    const newPaths = await Promise.all(promises);
    const hashedFiles = {};
    for (let i = 0; i < oldPaths.length; i++) {
        hashedFiles[oldPaths[i]] = newPaths[i];
    }
    return hashedFiles;
}
async function replacePlaceholders(rootDir, outDir, paths, hashedFiles) {
    const promises = [];
    for (let i = 0; i < paths.length; i++) {
        if (/\.(?:html|css|js)$/.test(paths[i])) {
            promises.push((async function () {
                const txt = await fs.readFile(paths[i], {
                    encoding: "utf-8",
                });
                const replaced = txt.replace(/({{)([^{}]+)(}})/g, (_, __, oldRelativePath) => {
                    const oldPath = path.resolve(path.dirname(paths[i]), oldRelativePath);
                    return replacer(rootDir, oldPath, hashedFiles);
                });
                const outRelativePath = path.relative(rootDir, hashedFiles[paths[i]]);
                const outPath = path.resolve(outDir, outRelativePath);
                await fs.mkdir(path.dirname(outPath), { recursive: true });
                await fs.writeFile(outPath, replaced, {
                    encoding: "utf-8",
                });
            })());
        }
    }
    await Promise.all(promises);
}
function replacer(rootDir, oldPath, hashed) {
    const newPath = hashed[oldPath];
    return path.relative(rootDir, newPath);
}
async function main(rootDir, outDir) {
    const projectFiles = await getFilePaths(rootDir);
    const hashedFiles = await hashFileNames(projectFiles);
    await replacePlaceholders(rootDir, outDir, projectFiles, hashedFiles);
}
await main("/home/wrigh/Documents/onion/src", "/home/wrigh/Documents/onion/dist");
