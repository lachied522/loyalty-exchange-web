export type ResolvedPromise<T> = T extends Promise<infer R> ? R: never;
