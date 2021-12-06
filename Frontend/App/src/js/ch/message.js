async function sendMessage(id, username, character, message, command) {
    const msg = {
        Id: id,
        User: username,
        Character: character,
        Text: message,
        Command: command
    }

    const response = await fetch('localhost:3000/chat/send_message', {
        method: "POST",
        body: JSON.stringify(msg),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })

    return response.json();  
};

async function getAllMessages() {
    const response = await fetch('localhost:3000/chat/getall');

    return response.json();  
};

async function getMessageByID(id) {
    var url = new URL('localhost:3000/chat/get_by_id?')
    var param = {Id: id}
    url.search = new URLSearchParams(param).toString;
    const response = await fetch(url);

    return response.json();  
};

async function getMessageSince(id) {
    var url = new URL('localhost:3000/chat/get_since?')
    var param = {Id: id}
    url.search = new URLSearchParams(param).toString;
    const response = await fetch(url);

    return response.json();  
};

module.exports = {
    sendMessage,
    getAllMessages,
    getMessageByID,
    getMessageSince
};