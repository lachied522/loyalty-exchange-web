// see https://api.basiq.io/reference/gettransactions
export type Transaction = {
    type: 'transaction'
    id: string // id of the account transaction belongs to
    description: string // description as assigned by institution (bank)
    amount: string
    account: string
    direction: 'debit'|'credit'
    class: 'payment'|'transfer'|'refund'
    institution: string
    connection: string
    reference: string
    transactionDate: string // date of transaction (appears on bank statement)
    postDate: string // date transaction was posted, use as backup to transactionDate
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

// see https://api.basiq.io/reference/getjobs
export type Job = {
    type: string
    id: string
    created: string // date & time job was created
    updated: string // data & time job was last updated
    steps: {
        title: 'verify-credentials'|'retrieve-accounts'|'retrieve-transactions'|'retrieve-statements'
        status: 'success'|'pending'|'failed'|'in-progress'
        result: {
            title: string
            type: string
            url: string // url of resource
            detail: string
        } | null
    }[]
    links: {
        self: string
        source: string
    }
}

// see https://api.basiq.io/reference/getconnection-1
export type Connection = {
    type: 'connection'
    id: string
    status: 'active'|'pending'|'invalid'
    method: string // indicates web or Open Banking
    createdDate: string // date connection was created
    expiryDate: string // date connection expires
    lastUsed: string // UTC date and time connection last used
    accounts: Account[]
    instition: {
        id: string
    }
    links: {
        self: string
        accounts: string
        transactions: string
        user: string
    }
}