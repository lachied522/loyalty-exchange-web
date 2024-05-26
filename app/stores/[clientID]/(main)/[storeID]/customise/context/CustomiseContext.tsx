"use client";
import { createContext, useContext, useState, useMemo, useCallback } from "react";

import { updateStoreRecord } from "@/utils/crud/stores";
import { upsertRewardRecord, deleteReward } from "@/utils/crud/rewards";

import { uploadImage } from "../actions/upload-image";

import { type ClientIDState, useClientIDContext } from "../../../../context/ClientIDContext";
import { type StoreIDState, useStoreIDContext } from "../../context/StoreIDContext";

import type { Tables, TablesInsert, TablesUpdate } from "@/types/supabase";

export type CustomiseState = {
    updateStoreRecordAndUpdateState: (data: TablesUpdate<'stores'>) => Promise<void>
    insertRewardRecordAndUpdateState: (data: Omit<TablesInsert<'rewards'>, 'id'|'store_id'>) => Promise<void>
    updateRewardRecordAndUpdateState: (data: TablesUpdate<'rewards'>) => Promise<void>
    deleteRewardRecordAndUpdateState: (rewardID: string) => Promise<void>
    uploadImageFromFile: (file: File, bucket: 'stores'|'rewards'|'logos') => Promise<string | undefined>
}

const CustomiseContext = createContext<any>(null);

export const useCustomiseContext = () => {
    return useContext(CustomiseContext);
};

interface CustomiseContextProviderProps {
    children: React.ReactNode
}

export default function CustomiseContextProvider({ children }: CustomiseContextProviderProps) {
    const { supabase, dispatch } = useClientIDContext() as ClientIDState;
    const { storeID, storeData } = useStoreIDContext() as StoreIDState;

    const updateStoreRecordAndUpdateState = useCallback(
        async (data: TablesUpdate<'stores'>) => {
            await updateStoreRecord(data, storeID, supabase);

            dispatch({
                type: 'UPDATE_STORE',
                payload: { data, storeID },
            })
        },
        [supabase, storeID, dispatch]
    );

    const insertRewardRecordAndUpdateState = useCallback(
        async (data: Omit<TablesInsert<'rewards'>, 'id'|'store_id'>) => {
            const newRecord = await upsertRewardRecord({ ...data, store_id: storeID }, supabase);

            dispatch({
                type: 'INSERT_NEW_REWARD',
                payload: { data: newRecord },
            })
        },
        [supabase, storeID, dispatch]
    );

    const updateRewardRecordAndUpdateState = useCallback(
        async (data: Tables<'rewards'>) => {
            await upsertRewardRecord(data, supabase);

            dispatch({
                type: 'UPDATE_REWARD',
                payload: { data, rewardID: data.id },
            })
        },
        [supabase, dispatch]
    );

    const deleteRewardRecordAndUpdateState = useCallback(
        async (rewardID: string) => {
            await deleteReward(rewardID, supabase);

            dispatch({
                type: 'DELETE_REWARD',
                payload: { rewardID },
            })
        },
        [supabase, dispatch]
    );

    const uploadImageFromFile = useCallback(
        async (file: File, bucket: 'stores'|'rewards'|'logos') => {
            const formData = new FormData();
            formData.set('image', file);

            return await uploadImage(
                storeID + '_image',
                formData,
                bucket
            );
        },
        [storeID]
    );

    return (
        <CustomiseContext.Provider
            value={{
                updateStoreRecordAndUpdateState,
                insertRewardRecordAndUpdateState,
                updateRewardRecordAndUpdateState,
                deleteRewardRecordAndUpdateState,
                uploadImageFromFile,
            }}
        >
            {children}
        </CustomiseContext.Provider>
    )
}