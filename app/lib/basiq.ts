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
    return fetch('https://au-api.basiq.io/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${process.env.BASIQ_API_KEY}`, 
            'Content-Type': 'application/x-www-form-urlencoded', 
            'basiq-version': '3.0'
        },
        body: JSON.stringify({ scope: 'SERVER_ACCESS' }),
    })
    .then((res) => res.json())
    .then((res) => res['access_token']);
}

export async function createBasiqUser(
    email: string,
    mobile: string,
): Promise<string> {
    const serverAccessToken = await getBasiqServerAccessToken();

    return fetch('https://au-api.basiq.io/users', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${serverAccessToken}`,
            'Content-Type': 'application/json', 
            'Accept': 'application/json'
        },
        body: JSON.stringify({ email, mobile }),
    })
    .then((res) => res.json())
    .then((res) => res['id']);
}

// see docs at https://api.basiq.io/docs/quickstart-api
export async function getClientTokenBoundToUser(
    BasiqUserId: string
): Promise<string> {
    return fetch('https://au-api.basiq.io/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${process.env.BASIQ_API_KEY}`, 
            'Content-Type': 'application/x-www-form-urlencoded', 
            'basiq-version': '3.0'
        },
        body: JSON.stringify({ scope: 'CLIENT_ACCESS', userId: BasiqUserId }),
    })
    .then((res) => res.json())
    .then((res) => res['access_token']);
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
    return fetch(`https://au-api.basiq.io/users/${BasiqUserId}/transactions?limit=${limit}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${serverAccessToken}`,
            'Accept': 'application/json',
        }
    })
    .then((res) => res.json())
    .then((res) => res.data);
}

export async function fetchUserAccounts(
    BasiqUserId: string | null,
): Promise<Account[]> {
    if (!BasiqUserId) return [];

    const serverAccessToken = await getBasiqServerAccessToken();

    return fetch(`https://au-api.basiq.io/users/${BasiqUserId}/accounts`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${serverAccessToken}`,
            'Accept': 'application/json',
        }
    })
    .then((res) => res.json())
    .then((res) => res.data);
}