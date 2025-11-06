{
  "name": "Technician",
  "type": "object",
  "properties": {
    "user_email": {
      "type": "string",
      "description": "Email of the user account"
    },
    "full_name": {
      "type": "string",
      "description": "Full name of the technician"
    },
    "phone": {
      "type": "string",
      "description": "Contact phone number"
    },
    "service_type": {
      "type": "string",
      "enum": [
        "electrician",
        "plumber",
        "carpenter",
        "ac_repair",
        "painter",
        "cleaning"
      ],
      "description": "Primary service offered"
    },
    "experience_years": {
      "type": "number",
      "description": "Years of experience"
    },
    "description": {
      "type": "string",
      "description": "About the technician"
    },
    "location": {
      "type": "string",
      "description": "City or area served"
    },
    "areas_served": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of localities/areas served"
    },
    "rating": {
      "type": "number",
      "default": 0,
      "description": "Average rating"
    },
    "total_reviews": {
      "type": "number",
      "default": 0,
      "description": "Number of reviews"
    },
    "profile_photo": {
      "type": "string",
      "description": "URL to profile photo"
    },
    "approved": {
      "type": "boolean",
      "default": false,
      "description": "Admin approval status"
    },
    "active": {
      "type": "boolean",
      "default": true,
      "description": "Account active status"
    }
  },
  "required": [
    "user_email",
    "full_name",
    "phone",
    "service_type",
    "location"
  ]
}