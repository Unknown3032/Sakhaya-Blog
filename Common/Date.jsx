var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const getDay = (timestamp) => {
    let date = new Date(timestamp)

    return `${date.getDate()} ${month[date.getMonth()]}`
}

export const getFullDay = (timestamp) => {
    let date = new Date(timestamp)

    return `${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}`
}