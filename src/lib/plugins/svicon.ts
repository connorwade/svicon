const sviconRegex = /<Svicon.*?\/>/g;
const iconPropertyRegex = /<Svicon[^>]*iconName="([^"]*)"/g;
const typePropertyRegex = /<Svicon[^>]*type="([^"]*)"/g;
const svelteHeadRegex = /<svelte:head>.*?<\/svelte:head>/s;

const sviconHeaderTypeMap = new Map([
    ['outlined', 'Material+Symbols+Outlined'],
    ['rounded', 'Material+Symbols+Rounded'],
    ['sharp', 'Material+Symbols+Sharp'],
])

function buildHeader(content: string, sviconMap: Map<string, string[]>): string {
    let head = `<svelte:head></svelte:head>`;
    const headMatch = content.match(svelteHeadRegex);
    head = headMatch ? headMatch[0] : head;
    content = content.replace(svelteHeadRegex, '');
    let links = '';
    let headSplit = head.split('</svelte:head>');
    for (const [type, icons] of sviconMap.entries()) {
        const iconStr = `&${icons.join(',')}`
        links += `<link href="https://fonts.googleapis.com/css2?family=${sviconHeaderTypeMap.get(type)}${iconStr}&display=block" rel="stylesheet" />\n`
    }
    let newContent = `${headSplit.join(links + '</svelte:head>')}\n${content}`;

    return newContent;
}

export const sveltePlugin = ({ mode = "css-link" }: { mode: 'css-link' | 'local-cache'; }): import('svelte/compiler').PreprocessorGroup => ({
    name: 'svicon',
    markup({ content, filename }) {
        if (sviconRegex.test(content)) {

            let sviconMap: Map<string, string[]> = new Map();

            let sviconMatches = content.matchAll(sviconRegex);
            for (const match of sviconMatches) {
                const iconPropMatch = match[0].match(iconPropertyRegex);
                const typePropMatch = match[0].match(typePropertyRegex);
                const iconProp = iconPropMatch ? iconPropMatch[1] : '';
                if (!iconProp) {
                    throw new Error('Svicon Error: Icon name is required');
                }
                const typeProp = typePropMatch ? typePropMatch[1] : 'outlined';
                if (!sviconMap.has(typeProp)) {
                    sviconMap.set(typeProp, [iconProp]);
                } else {
                    sviconMap.get(typeProp)!.push(iconProp);
                }
            }

            const code = buildHeader(content, sviconMap);

            return {
                code,
            }
        }

    }
})