"use client";
import { createContext, useContext, useState, useMemo, useCallback } from "react";

import { updateStoreRecord } from "@/utils/crud/stores";
import { upsertRewardRecord, deleteReward } from "@/utils/crud/rewards";

import { uploadImage } from "../actions/upload-image";

import { type ClientState, useClientContext } from "../../../context/ClientContext";

import type { Tables, TablesInsert, TablesUpdate } from "@/types/supabase";

export type CustomiseState = {
    selectedStoreID: string
    selectedStoreData: ClientState['clientData']['stores'][number]
    setSelectedStoreID: React.Dispatch<React.SetStateAction<string>>

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
    const { supabase, clientData, dispatch } = useClientContext() as ClientState;
    const [selectedStoreID, setSelectedStoreID] = useState<string>(clientData.stores[0].id);

    const selectedStoreData = useMemo(() => {
        return clientData.stores.find((store) => store.id === selectedStoreID);
    }, [selectedStoreID, clientData]);

    const updateStoreRecordAndUpdateState = useCallback(
        async (data: TablesUpdate<'stores'>) => {
            await updateStoreRecord(data, selectedStoreID, supabase);

            dispatch({
                type: 'UPDATE_STORE',
                payload: { data, storeID: selectedStoreID },
            })
        },
        [supabase, selectedStoreID]
    );

    const insertRewardRecordAndUpdateState = useCallback(
        async (data: Omit<TablesInsert<'rewards'>, 'id'|'store_id'>) => {
            const newRecord = await upsertRewardRecord({ ...data, store_id: selectedStoreID }, supabase);

            dispatch({
                type: 'INSERT_NEW_REWARD',
                payload: { data: newRecord },
            })
        },
        [supabase, selectedStoreID]
    );

    const updateRewardRecordAndUpdateState = useCallback(
        async (data: Tables<'rewards'>) => {
            await upsertRewardRecord(data, supabase);

            dispatch({
                type: 'UPDATE_REWARD',
                payload: { data, rewardID: data.id },
            })
        },
        [supabase, selectedStoreID]
    );

    const deleteRewardRecordAndUpdateState = useCallback(
        async (rewardID: string) => {
            await deleteReward(rewardID, supabase);

            dispatch({
                type: 'DELETE_REWARD',
                payload: { rewardID },
            })
        },
        [supabase, selectedStoreID]
    );

    const uploadImageFromFile = useCallback(
        async (file: File, bucket: 'stores'|'rewards'|'logos') => {
            const formData = new FormData();
            formData.set('image', file);

            return await uploadImage(
                selectedStoreID + '_image',
                formData,
                bucket
            );
        },
        [selectedStoreID]
    );

    return (
        <CustomiseContext.Provider
            value={{
                selectedStoreID,
                selectedStoreData,
                setSelectedStoreID,
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