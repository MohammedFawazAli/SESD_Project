{
  "name": "Booking",
  "type": "object",
  "properties": {
    "customer_email": {
      "type": "string",
      "description": "Email of customer"
    },
    "customer_name": {
      "type": "string",
      "description": "Name of customer"
    },
    "customer_phone": {
      "type": "string",
      "description": "Customer contact"
    },
    "technician_id": {
      "type": "string",
      "description": "ID of technician"
    },
    "technician_name": {
      "type": "string",
      "description": "Name of technician"
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
      "description": "Service requested"
    },
    "booking_date": {
      "type": "string",
      "format": "date",
      "description": "Date of appointment"
    },
    "time_slot": {
      "type": "string",
      "description": "Time slot (e.g., 10:00 AM - 12:00 PM)"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "accepted",
        "rejected",
        "completed",
        "cancelled"
      ],
      "default": "pending",
      "description": "Booking status"
    },
    "notes": {
      "type": "string",
      "description": "Additional notes from customer"
    },
    "rejection_reason": {
      "type": "string",
      "description": "Reason for rejection if applicable"
    }
  },
  "required": [
    "customer_email",
    "technician_id",
    "service_type",
    "booking_date",
    "time_slot"
  ]
}