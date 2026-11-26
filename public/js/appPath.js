const basePath = new URL('../', import.meta.url).pathname;

export function appPath(path = '/') {
    return basePath + path.replace(/^\/+/, '');
}
