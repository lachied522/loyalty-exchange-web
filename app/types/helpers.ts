import type { Tables } from "./supabase";

export type ResolvedPromise<T> = T extends Promise<infer R> ? R: never;

export type Reward = Tables<'rewards'>;

export type ClientData = (
    Tables<'clients'> & {
        stores: (
            Tables<'stores'> & {
                rewards: Tables<'rewards'>[]
            }
        )[]
    }
)