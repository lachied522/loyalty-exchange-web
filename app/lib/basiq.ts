// see https://api.basiq.io/reference/gettransactions
export type Transaction = {
    type: 'transaction'
    id: string // id of the account transaction belongs to
    description: string // description as assigned by institution (bank)
    amount: string
    account: string
    direction: 'debit'|'credit'
    institution: string
    connection: string
    reference: string
    postDate: string
    subClass: {
        title: string
    }
}

// see https://api.basiq.io/reference/getaccounts
export type Account = {
    type: 'account'
    id: string
    bsb: string
    unmaskedAccNum: string // unmasked a/c number
    maskedNumber: string // masked version of a/c number
    accountNo: string // BSB + a/c number
    name: string // account name
    accountHolder: string // name of accountholder
    connection: string // id of the 'connection' resource
    class: 'transaction'|'savings'|'credit-card'|'mortgage'|'loan'|'investment'
}

export async function getBasiqServerAccessToken(): Promise<string> {
    const res = await fetch(
        'https://au-api.basiq.io/token',
        {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${process.env.BASIQ_API_KEY}`, 
                'Content-Type': 'application/x-www-form-urlencoded', 
                'basiq-version': '3.0'
            },
            body: JSON.stringify({ scope: 'SERVER_ACCESS' }),
        }
    );

    if (!res.ok) {
        console.log('Error fetching Basiq server access token, status: ', res.status);
        throw new Error('Error fetching Basiq server access token.')
    }

    return await res.json().then(({ access_token }) => access_token);
}

export async function createBasiqUser(
    email: string,
    mobile: string,
): Promise<string> {
    const serverAccessToken = await getBasiqServerAccessToken();

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
        throw new Error('Error creating Basiq user.')
    }

    return await res.json().then(({ id }) => id);
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

export async function fetchUserTransactions(
    BasiqUserId: string | null,
    limit: number = 10
): Promise<Transaction[]> {
    if (!BasiqUserId) return [];
    // get Basiq access token
    const serverAccessToken = await getBasiqServerAccessToken();

    // get last 10 transactions
    // it is possible user makes more than 10 transactions before we can update their point counts
    const res = await fetch(
        `https://au-api.basiq.io/users/${BasiqUserId}/transactions?limit=${limit}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${serverAccessToken}`,
                'Accept': 'application/json',
            }
        }
    );

    if (!res.ok) {
        console.log('error fetching user transactions, status: ', res.status);
        throw new Error('Error fetching user transactions.');
    }

    return await res.json().then(({ data }) => data);
}

export async function fetchUserAccounts(
    BasiqUserId: string | null,
): Promise<Account[]> {
    if (!BasiqUserId) return [];

    const serverAccessToken = await getBasiqServerAccessToken();

    const res = await fetch(
        `https://au-api.basiq.io/users/${BasiqUserId}/accounts`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${serverAccessToken}`,
                'Accept': 'application/json',
            }
        }
    );

    if (!res.ok) {
        console.log('error fetching user accounts, status: ', res.status);
        throw new Error('Error fetching user accounts.');
    }

    return await res.json().then(({ data }) => data);
}