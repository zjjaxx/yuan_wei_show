import protobuf from "protobufjs"
const PR = protobuf.parse("syntax = \"proto3\";  \npackage yd;\n\nmessage data{\nstring y = 1;\nstring d = 2;\n}");
const AwesomeMessage = PR.root.lookupType("yd.data")

export function send(data,webSocket){
    let errMsg = AwesomeMessage.verify(data);
    console.log('errmsg', errMsg)
    if (errMsg){
        data.y = ""+data.y;
        data.d = ""+data.d;
    }

    let message = AwesomeMessage.create(data);
    console.log('message', message)
    let buffer  = AwesomeMessage.encode(message).finish();
    console.log('buffer', buffer)
    webSocket.send(buffer)
}

export function parseReceiveMessage(evt){
    const received_msg = evt.data;
    console.log('received_msg', received_msg)
    let data
    try {

        let buffer = new Uint8Array(evt.data);
        let decodedMessage = AwesomeMessage.decode(buffer);
        data = AwesomeMessage.toObject(decodedMessage, {c: String,  j: String});
    } catch (e) {
        if (e instanceof protobuf.util.ProtocolError) {
            data = JSON.parse(evt.data);
        } else {
            data = JSON.parse(evt.data);
        }
    }

    console.log('DATA', data)
    return data
}