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
    var url = new URL('http://127.0.0.1:5000/chat/get_by_id')
    var param = {Id: id}
    const response = await fetch(url, {
        method: "POST",
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(param)
    });
    return response.json();  
};

async function getMessageSince(id) {
    var param = {Id: id}
    try{
        let response = await fetch('http://127.0.0.1:5000/chat/get_since',{
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(param)
        });
        let json = await response.json();
        console.log("FETCHED MESSAGE SINCE");
        console.log(json);
        return json;
        
    } catch(error) {
        console.log("FAILED TO FETCH MESSAGE SINCE")
        console.log(error)
    }
};

module.exports = {
    sendMessage,
    getAllMessages,
    getMessageByID,
    getMessageSince
};