export type Transaction = {
    type: 'transaction',
    id: string,
    description: string
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

export async function getBasiqServerAccessToken(): Promise<string> {
    return fetch('https://au-api.basiq.io/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${process.env.NEXT_PUBLIC_BASIQ_API_KEY}`, 
            'Content-Type': 'application/x-www-form-urlencoded', 
            'basiq-version': '3.0'
        },
        body: JSON.stringify({ scope: 'SERVER_ACCESS' }),
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
    const BasiqServerAccessToken = await getBasiqServerAccessToken();

    // get last 10 transactions
    // it is possible user makes more than 10 transactions before we can update their point counts
    return fetch(`https://au-api.basiq.io/users/${BasiqUserId}/transactions?limit=${limit}`, {
        headers: {
            'Authorization': `Bearer ${BasiqServerAccessToken}`,
            'Accept': 'application/json',
        }
    })
    .then((res) => res.json())
    .then((res) => res.data);
}