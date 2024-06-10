import type { ClientData } from "@/types/helpers";

export type Action = {
    type: 'SET_DATA',
    payload: ClientData
} | {
    type: 'INSERT_NEW_STORE',
    payload: {
        data: Omit<ClientData['stores'][number], 'rewards'>
    }
} | {
    type: 'UPDATE_STORE',
    payload: {
        data: Partial<ClientData['stores'][number]>
        storeID: string
    }
} | {
    type: 'INSERT_NEW_REWARD',
    payload: {
        data: ClientData['stores'][number]['rewards'][number]
    }
} | {
    type: 'UPDATE_REWARD',
    payload: {
        data: Partial<ClientData['stores'][number]['rewards'][number]>
        rewardID: string
    }
} | {
    type: 'DELETE_REWARD',
    payload: {
        rewardID: string
    }
} | {
    type: 'RECOVER_REWARD',
    payload: {
        rewardID: string
    }
}

export function ClientReducer(state: ClientData, action: Action) {
    switch (action.type) {
        case 'SET_DATA': {
            return action.payload;
        }

        case 'INSERT_NEW_STORE': {
            return {
                ...state,
                stores: [
                    ...state.stores,
                    {
                        ...action.payload.data,
                        rewards: []
                    },
                ]
            }
        }

        case 'UPDATE_STORE': {
            return {
                ...state,
                stores: state.stores.map((store) => {
                    if (store.id === action.payload.storeID) {
                        return {
                            ...store,
                            ...action.payload.data
                        };
                    }

                    return store;
                })
            }
        }

        case 'INSERT_NEW_REWARD': {
            return {
                ...state,
                stores: state.stores.map((store) => {
                    if (store.id === action.payload.data.store_id) {
                        return {
                            ...store,
                            rewards: [...store.rewards, action.payload.data],
                        }
                    }

                    return store;
                })
            }
        }

        case 'UPDATE_REWARD': {
            return {
                ...state,
                stores: state.stores.map((store) => {
                    if (store.id === action.payload.data.store_id) {
                        return {
                            ...store,
                            rewards: store.rewards.map((reward) => {
                                if (reward.id === action.payload.rewardID) {
                                    return {
                                        ...reward,
                                        ...action.payload.data,
                                    };
                                }

                                return reward;
                            }),
                        }
                    }

                    return store;
                })
            }
        }

        case 'DELETE_REWARD': {
            return {
                ...state,
                stores: state.stores.map((store) => {
                    return {
                        ...store,
                        rewards: store.rewards.filter((reward) => reward.id!==action.payload.rewardID),
                    };
                })
            }
        }

        default: 
            return state;
    }
}