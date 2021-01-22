const schema = {
    "id": "/doctor",
    "type": "object",
    "properties": {
      "name": {"type": "string", "maxLength":100 , "minLength": 2},
      "lastName": {"type": "string", "maxLength":100, "minLength": 2},
      "phone": {"type":"string","maxLength":15,  "minLength": 2},
      "email": {"type":"string", "format": "email"},
      "emergencyPhone": {"type":"string","maxLength":15,"minLength": 2},
      "password": {"type":"string","maxLength":100,"minLength": 4},
      "birthdate": {"type": "string", "format": "date"},
      "medicalArea":  {"type": "string","enum": ["médico general","dentista","pediatra","nutriólogo","cardiólogo","médico obsteta","otorrinolaringólogo","médico de diagnóstico"]},
      "description": {"type": "string"},
      "jobTitle": {"type": "string"},
      "professionalLicense": {"type": "string"},
      "nationality": {"type": "string"},
      "maritalStatus": {"type": "string","enum": ["casado","soltero","divorciado","viudo"]}
    },
      "additionalProperties": false,
      
  };

module.exports= schema