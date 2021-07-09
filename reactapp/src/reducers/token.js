export default function(token = null, action) {
    if(action.type === 'sign-up') {
        var newToken = action.token
        return newToken
    } else {
        return token
    }
}