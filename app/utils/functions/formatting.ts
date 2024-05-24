
const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
})

export function formatCurrency(value: number) {
    return USDollar.format(value);
}

export function formatAmount(value: number) {
    const _formatted = formatCurrency(value);
    return value > 0? `+${_formatted}`: _formatted;
}

export function formatDate(dateString: string) {
    const date = new Date(dateString);
    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
    const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
    const day = date.getDate().toString().padStart(2, '0');
    return `${dayOfWeek} ${day} ${monthName}`;
}