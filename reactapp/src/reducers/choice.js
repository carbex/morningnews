export default function(choice = {country: 'fr', language: 'fr'}, action) {
    if(action.type === 'addSource') {
        var newChoice = action.choice
        return newChoice
    } else {
        return choice
    }
}