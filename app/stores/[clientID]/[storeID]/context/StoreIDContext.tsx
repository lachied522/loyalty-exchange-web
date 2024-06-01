"use client";
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

import { updateStoreRecord } from "@/utils/crud/stores";
import { upsertRewardRecord, deleteReward } from "@/utils/crud/rewards";

import { uploadImage } from "../../actions/upload-image";

import { type ClientIDState, useClientIDContext } from "../../context/ClientIDContext";

import type { Tables, TablesInsert, TablesUpdate } from "@/types/supabase";

export type StoreIDState = {
    storeID: string
    storeData: ClientIDState['clientData']['stores'][number]
    customersData: ClientIDState['customerDataMap'][string] | null
    updateStoreRecordAndUpdateState: (data: TablesUpdate<'stores'>) => Promise<void>
    insertRewardRecordAndUpdateState: (data: Omit<TablesInsert<'rewards'>, 'id'|'store_id'>) => Promise<Tables<'rewards'>>
    updateRewardRecordAndUpdateState: (data: TablesUpdate<'rewards'>) => Promise<void>
    deleteRewardRecordAndUpdateState: (rewardID: string) => Promise<void>
    uploadImageFromFile: (file: File, bucket: 'stores'|'rewards'|'logos') => Promise<string | undefined>
}

const StoreIDContext = createContext<any>(null);

export const useStoreIDContext = () => {
    return useContext(StoreIDContext);
};

interface StoreIDContextProviderProps {
    children: React.ReactNode
    storeID: string
}

export default function StoreIDContextProvider({
    children,
    storeID
}: StoreIDContextProviderProps) {
    const { clientData, supabase, dispatch } = useClientIDContext() as ClientIDState;

    const storeData = useMemo(() => {
        return clientData.stores.find((store) => store.id === storeID);
    }, [storeID, clientData.stores]);
    
    const updateStoreRecordAndUpdateState = useCallback(
        async (data: TablesUpdate<'stores'>) => {
            // prevent unnecessary updates by checking if incoming is different to existing data
            let hasChanges = false;
            for (const key in data) {
                if (
                    data[key as keyof typeof data] !==
                    storeData?.[key as keyof typeof storeData]
                ) {
                    hasChanges = true;
                    break
                };
            }
            if (!hasChanges) return;

            await updateStoreRecord(data, storeID, supabase);

            dispatch({
                type: 'UPDATE_STORE',
                payload: { data, storeID },
            })
        },
        [storeData, supabase, storeID, dispatch]
    );

    const insertRewardRecordAndUpdateState = useCallback(
        async (data: Omit<TablesInsert<'rewards'>, 'id'|'store_id'>) => {
            const newRecord = await upsertRewardRecord({ ...data, store_id: storeID }, supabase);

            dispatch({
                type: 'INSERT_NEW_REWARD',
                payload: { data: newRecord },
            });

            return newRecord;
        },
        [supabase, storeID, dispatch]
    );

    const updateRewardRecordAndUpdateState = useCallback(
        async (data: Tables<'rewards'>) => {
            // prevent unnecessary updates by checking if incoming is different to existing data
            let hasChanges = false;
            const current = storeData?.rewards.find((obj) => obj.id === data.id);
            for (const key in data) {
                if (
                    data[key as keyof typeof data] !==
                    current?.[key as keyof typeof current]
                ) {
                    hasChanges = true;
                    break
                };
            }
            if (!hasChanges) return;

            await upsertRewardRecord(data, supabase);

            dispatch({
                type: 'UPDATE_REWARD',
                payload: { data, rewardID: data.id },
            })
        },
        [storeData, supabase, dispatch]
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
        <StoreIDContext.Provider
            value={{
                storeData,
                storeID,
                updateStoreRecordAndUpdateState,
                insertRewardRecordAndUpdateState,
                updateRewardRecordAndUpdateState,
                deleteRewardRecordAndUpdateState,
                uploadImageFromFile,
            }}
        >
            {children}
        </StoreIDContext.Provider>
    )
}