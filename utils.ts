export async function getFoldersFromPattren() {
    return import.meta.glob<{ default: Record<string, string> }>(
        "./projects/**/index.vue", 
        {eager: true,}
    );         
}
export function _l(...args: any[]){
    console.log(...args)
}