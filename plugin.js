const sviconRegex = /<Svicon.*?\/>/g;
const iconPropertyRegex = /<Svicon[^>]*iconName="([^"]*)"/g;
const typePropertyRegex = /<Svicon[^>]*type="([^"]*)"/g;
const svelteHeadRegex = /<svelte:head>.*?<\/svelte:head>/s;

const sviconHeaderTypeMap = new Map([
    ['outlined', 'Material+Symbols+Outlined'],
    ['rounded', 'Material+Symbols+Rounded'],
    ['sharp', 'Material+Symbols+Sharp'],
])

/**
 * 
 * @param {string} content
 * @param {Map<string, string[]>} sviconMap
 * @returns {string}
 */
function buildHeader(content, sviconMap) {
    let head = `<svelte:head></svelte:head>`;
    if (svelteHeadRegex.test(content)) {
        head = content.match(svelteHeadRegex)[0];
        content = content.replace(svelteHeadRegex, '');
    }
    let links = '';
    let headSplit = head.split('</svelte:head>');
    for (const [type, icons] of sviconMap.entries()) {
        const iconStr = `&${icons.join(',')}`
        links += `<link href="https://fonts.googleapis.com/css2?family=${sviconHeaderTypeMap.get(type)}${iconStr}" rel="stylesheet" />\n`
    }
    let newContent = `${headSplit.join(links + '</svelte:head>')}\n${content}`;

    return newContent;
}


/**
 * 
 * @returns {import('svelte/compiler').PreprocessorGroup}
 */
export const sveltePlugin = () => ({
    name: 'svicon',
    markup({ content, filename }) {
        if (sviconRegex.test(content)) {

            /**
             * @type {Map<string, string[]>}
             */
            let sviconMap = new Map();

            let sviconMatches = content.matchAll(sviconRegex);
            for (const match of sviconMatches) {
                const iconPropMatch = match[0].matchAll(iconPropertyRegex);
                const typePropMatch = match[0].matchAll(typePropertyRegex);
                const iconProp = iconPropMatch.next().value[1];
                const typeProp = typePropMatch.next().value[1];
                if (!sviconMap.has(typeProp)) {
                    sviconMap.set(typeProp, [iconProp]);
                } else {
                    sviconMap.get(typeProp).push(iconProp);
                }
            }

            const code = buildHeader(content, sviconMap);

            return {
                code,
            }
        }

    }
})