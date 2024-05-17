import { getBasiqServerAccessToken } from "./server";

export async function createBasiqUser(
    email: string,
    mobile: string,
    serverAccessToken?: string,
): Promise<string> {
    if (!serverAccessToken) {
        serverAccessToken = await getBasiqServerAccessToken();
    }

    const res = await fetch(
        'https://au-api.basiq.io/users',
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serverAccessToken}`,
                'Content-Type': 'application/json', 
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, mobile }),
        }
    );

    if (!res.ok) {
        console.log('Error creating Basiq user, status: ', res.status);
        throw new Error('Error creating Basiq user.');
    }

    return await res.json().then(({ id }) => id);
}

export async function deleteBasiqUser(
    BasiqUserId: string,
    serverAccessToken?: string
) {
    if (!BasiqUserId) return;

    if (!serverAccessToken) {
        serverAccessToken = await getBasiqServerAccessToken();
    }

    const res = await fetch(
        `https://au-api.basiq.io/users/${BasiqUserId}`,
        {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${serverAccessToken}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify({ scope: 'SERVER_ACCESS' }),
        }
    );
    
    if (!res.ok) {
        console.log('Error deleting Basiq user, status: ', res.status);
        throw new Error('Error deleting Basiq user.');
    };

    return await res.json();
}

// see docs at https://api.basiq.io/docs/quickstart-api
export async function getClientTokenBoundToUser(
    BasiqUserId: string
): Promise<string> {
    const res = await fetch(
        'https://au-api.basiq.io/token',
        {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${process.env.BASIQ_API_KEY}`, 
                'Content-Type': 'application/x-www-form-urlencoded', 
                'basiq-version': '3.0'
            },
            body: JSON.stringify({ scope: 'CLIENT_ACCESS', userId: BasiqUserId }),
        }
    );

    if (!res.ok) {
        console.log('Error binding client token to user, status: ', res.status);
        throw new Error('Error binding client token to user.')
    }

    return await res.json().then(({ access_token }) => access_token);
}