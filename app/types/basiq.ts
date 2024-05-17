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