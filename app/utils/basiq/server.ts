

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