const schema = {
    "id": "/pathient",
    "type": "object",
    "properties": {
      "email": {"type":"string", "format": "email"},
      "password": {"type":"string","maxLength":100,"minLength": 4},
    },
    "additionalProperties": false
  };

module.exports= schema