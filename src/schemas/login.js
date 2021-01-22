const schema = {
    "id": "/login",
    "type": "object",
    "properties": {
      "email": {"type":"string", "format": "email"},
      "password": {"type":"string","maxLength":100,"minLength": 4},   
    },
      "additionalProperties": false
  };