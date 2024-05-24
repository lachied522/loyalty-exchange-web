
let accessToken: string | null;

export async function getBasiqServerAccessToken(): Promise<string> {
    if (!accessToken) {
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

        const { access_token } = await res.json();

        accessToken = access_token as string;
    }

    return accessToken;
}