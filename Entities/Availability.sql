{
  "name": "Availability",
  "type": "object",
  "properties": {
    "technician_id": {
      "type": "string",
      "description": "ID of technician"
    },
    "day_of_week": {
      "type": "string",
      "enum": [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
      ],
      "description": "Day of the week"
    },
    "start_time": {
      "type": "string",
      "description": "Start time (e.g., 09:00)"
    },
    "end_time": {
      "type": "string",
      "description": "End time (e.g., 18:00)"
    },
    "max_bookings": {
      "type": "number",
      "default": 4,
      "description": "Maximum bookings for this day"
    },
    "is_available": {
      "type": "boolean",
      "default": true,
      "description": "Whether technician is available this day"
    }
  },
  "required": [
    "technician_id",
    "day_of_week"
  ]
}