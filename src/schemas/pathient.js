
const schema = {
    "id": "/pathient",
    "type": "object",
    "properties": {
      "name": {"type": "string", "maxLength":100 , "minLength": 2},
      "lastName": {"type": "string", "maxLength":100, "minLength": 2},
      "phone": {"type":"string","maxLength":15,  "minLength": 2},
      "email": {"type":"string", "format": "email"},
      "emergencyPhone": {"type":"string","maxLength":15,"minLength": 2},
      "password": {"type":"string","maxLength":100,"minLength": 4},
      "birthdate": {"type": "string", "format": "date"}
    },
    "additionalProperties": false
  };

module.exports= schema