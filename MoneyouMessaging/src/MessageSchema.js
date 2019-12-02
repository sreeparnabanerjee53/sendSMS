exports.messageSchema = {
    "type": "object",
    "properties": {
        "message": {
            "type": "string",
            "minLength": 1,
            "maxLength": 90
        },
        "phoneNumber": {
            "type": "string",
            "minLength": 12,
            "maxLength": 12
        }
    },
    "required": ["message", "phoneNumber"]
};