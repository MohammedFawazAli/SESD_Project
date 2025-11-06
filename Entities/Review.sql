{
  "name": "Review",
  "type": "object",
  "properties": {
    "booking_id": {
      "type": "string",
      "description": "ID of the completed booking"
    },
    "customer_email": {
      "type": "string",
      "description": "Email of customer who reviewed"
    },
    "customer_name": {
      "type": "string",
      "description": "Name of customer"
    },
    "technician_id": {
      "type": "string",
      "description": "ID of technician being reviewed"
    },
    "rating": {
      "type": "number",
      "minimum": 1,
      "maximum": 5,
      "description": "Star rating (1-5)"
    },
    "comment": {
      "type": "string",
      "description": "Review comment"
    }
  },
  "required": [
    "booking_id",
    "customer_email",
    "technician_id",
    "rating"
  ]
}