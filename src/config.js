let baseURI
const dateFormat = 'YYYY-MM-DD HH:MM:SS'
const reportsDateFormat = 'YYYY-MM-DD'
if (process.env.NODE_ENV !== 'production') {
    baseURI = 'https://wslyeng.azurewebsites.net'
} else {
    baseURI = ''
}
export { baseURI, dateFormat, reportsDateFormat }
