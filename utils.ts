export async function getFoldersFromPattren() {
    return import.meta.glob<{ default: Record<string, string> }>(
        "./projects/**/index.vue", 
        {eager: true,}
    );         
}