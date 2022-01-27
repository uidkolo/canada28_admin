export const formatTime = (Date) => {
    const year = Date.getFullYear()
    const month = Date.getMonth() + 1
    const day = Date.getDate()
    const hours = Date.getHours()
    const minutes = Date.getMinutes()
    const seconds = Date.getSeconds()

    function test(value) {
        return value < 10 ? `0${value}` : value
    }

    return `${year}-${test(month)}-${test(day)} ${test(hours)}:${test(minutes)}:${test(seconds)}`
}