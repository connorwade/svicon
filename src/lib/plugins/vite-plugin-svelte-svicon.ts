import { writeFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import type { MaterialSymbolType } from "$lib/types/material-symbols-utils.js";
import type { MaterialSymbolName } from "$lib/types/material-symbols.js";
import type { Plugin } from "vite";

const isSvelteFile = /\.svelte$/;
const isCssFile = /\.css$/;
const sviconJsRegex = /Svicon\(.*, {.*}\)/g;
const sviconJsIconNameRegex = /iconName:\s*'([^']*)'/;;
const sviconJsTypeRegex = /type:\s*'([^']*)'/;;

interface SviconCacheInfo {
    date: Date;
    types: MaterialSymbolType[];
    icons: string[];
}

const sviconCache = new Map<MaterialSymbolType, MaterialSymbolName[]>();
const sviconCacheInfo: SviconCacheInfo = {
    date: new Date(),
    types: [],
    icons: []
};

const sviconHeaderTypeMap = new Map([
    ['outlined', 'Material+Symbols+Outlined'],
    ['rounded', 'Material+Symbols+Rounded'],
    ['sharp', 'Material+Symbols+Sharp'],
])

const cacheNeedsRefresh = (prevCache: SviconCacheInfo) => {
    for (const [type, icons] of sviconCache.entries()) {
        if (!prevCache.types.includes(type)) {
            return true;
        }
        for (const icon of icons) {
            if (!prevCache.icons.includes(`${type}:${icon}`)) {
                return true;
            }
        }
    }
    return false;
}

export const sviconVitePlugin = ({ mode = "local-cache" }: { mode: 'css-link' | 'local-cache'; }): Plugin => {
    return {
        name: 'svicon',
        transform(code, id) {
            if (isCssFile.test(id)) {
                // console.log('CSS_FOUND', code);
            }
            if ((isSvelteFile.test(id)) && sviconJsRegex.test(code)) {
                if (id.includes('+layout')) {
                    // console.log('LAYOUT_FOUND', code);
                }
                let sviconMatches = code.matchAll(sviconJsRegex);
                for (const match of sviconMatches) {
                    // console.log("MATCH:", match[0])
                    const iconPropMatch = match[0].match(sviconJsIconNameRegex);
                    const typePropMatch = match[0].match(sviconJsTypeRegex);
                    const iconProp = iconPropMatch ? iconPropMatch[1] as MaterialSymbolName : '';
                    if (!iconProp) {
                        throw new Error('Svicon Error: Icon name is required');
                    }
                    const typeProp = typePropMatch ? typePropMatch[1] as MaterialSymbolType : 'outlined';
                    if (!sviconCache.has(typeProp)) {
                        sviconCache.set(typeProp, [iconProp]);
                    } else if (sviconCache.has(typeProp)) {
                        sviconCache.get(typeProp)!.push(iconProp);
                    }
                }
                return code;
            }
        },
        async buildEnd() {
            if (mode === 'local-cache') {
                let previous: SviconCacheInfo | undefined;
                if (existsSync(`./.svicon/svicon.json`)) {
                    previous = JSON.parse(readFileSync(`./.svicon/svicon.json`, 'utf-8'));
                }
                if (previous && !cacheNeedsRefresh(previous)) {
                    console.log('SVICON CACHE UP TO DATE');
                    return;
                }
                let cssFileContent = '';
                for (const [type, icons] of sviconCache.entries()) {
                    if (!existsSync('./.svicon')) {
                        mkdirSync('./.svicon');
                    }
                    const res = await fetch(`https://fonts.googleapis.com/css2?family=${sviconHeaderTypeMap.get(type)}&${icons.join(',')}&display=block`)
                    const css = await res.text();
                    cssFileContent += `${css}\n`;
                    sviconCacheInfo.types.push(type);
                    sviconCacheInfo.icons.push(...icons.map(icon => `${type}:${icon}`));
                }
                writeFileSync(`./src/svicon.css`, cssFileContent);
                sviconCacheInfo.date = new Date();

                writeFileSync(`./.svicon/svicon.json`, JSON.stringify(sviconCacheInfo));
            }
        }

    }
}