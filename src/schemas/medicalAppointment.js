const schema = {
    "id": "/doctor",
    "type": "object",
    "properties": {
      "date": {"type": "string", "format": "date"},
      "turn": {"type": "integer", "minimum": 1, "Maximum": 16},
      "doctorId":{"type": "integer"}
    },
      "additionalProperties": false
  };

module.exports= schema