async function sendMessage(username, character, message, command) {
    const msg = {
        User: username,
        Character: character,
        Text: message,
    }

    console.log(JSON.stringify(msg))
    
    const response = await fetch('http://127.0.0.1:5000/chat/send_message', {
        method: "POST",
        body: JSON.stringify(msg),
        mode: 'no-cors',
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    console.log(response)
    return "{}"
};

async function getAllMessages() {
   
    try{
        let response = await fetch('http://127.0.0.1:5000/chat/getall');
        let responseJSON = await response.json();
        console.log("FETCHED")
        console.log(responseJSON)
        return responseJSON
    } catch(error) {
        console.log("FAILED TO FETCH")
        console.log(error)
    }
};

async function getMessageByID(id) {
    var url = new URL('http://127.0.0.1:5000/chat/get_by_id?')
    var param = {Id: id}
    url.search = new URLSearchParams(param).toString;
    const response = await fetch(url, {
        method: "GET",
        mode: 'no-cors'
    });
    return response.json();  
};

async function getMessageSince(id) {
    try{
        var url = new URL('http://127.0.0.1:5000/chat/get_since')
        var param = {Id: id}
        url.search = new URLSearchParams(param).toString;
        const response = await fetch(url);
        let responseJSON = await response.json();
        console.log("FETCHED")
        console.log(responseJSON)
        return responseJSON
    } catch(error) {
        console.log("FAILED TO FETCH")
        console.log(error)
    }
};

module.exports = {
    sendMessage,
    getAllMessages,
    getMessageByID,
    getMessageSince
};