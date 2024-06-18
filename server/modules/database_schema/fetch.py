import json
import logging
import os
from .util import extract_schema_from_messeage

logger = logging.getLogger("database_schema")
dirname = os.path.dirname(__file__)

for_who_query = "Generate database schema for application for "
doing_what_query = " doing "
details = """It will be mermaid erDiagram. Use single words! You are not allowed to use commas or quotas. Remember about table relationships (eg. Walks ||--o{ Bookings : part). Use this as and examplary diagram: 
```mermaid_erDiagram
{
  "schema": [
    {
      "Owners": {
        "owner_id": "INT PK",
        "price": "BigDecimal(10_2)",
        "first_name": "VARCHAR(50)",
        "last_name": "VARCHAR(50)",
        "email": "VARCHAR(100)",
        "phone": "VARCHAR(20)",
        "address": "VARCHAR(255)"
      }
    },
    {
      "Dogs": {
        "dog_id": "INT PK",
        "name": "VARCHAR(100)",
        "breed": "VARCHAR(100)",
        "age": "INT",
        "owner_id": "INT FK"
      }
    },
    {
      "Walks": {
        "walk_id": "INT PK",
        "dog_id": "INT FK",
        "walker_id": "INT FK",
        "date": "DATE",
        "duration_minutes": "INT",
        "location": "VARCHAR(255)"
      }
    },
    {
      "Walkers": {
        "walker_id": "INT PK",
        "name": "VARCHAR(100)",
        "contact_name": "VARCHAR(100)",
        "contact_email": "VARCHAR(100)",
        "contact_phone": "VARCHAR(20)"
      }
    },
    {
      "Reviews": {
        "review_id": "INT PK",
        "dog_id": "INT FK",
        "owner_id": "INT FK",
        "rating": "INT",
        "comment": "TEXT"
      }
    },
    {
      "Bookings": {
        "booking_id": "INT PK",
        "dog_id": "INT FK",
        "owner_id": "INT FK",
        "walk_id": "INT FK",
        "date": "DATE",
        "status": "ENUM(Pending_Confirmed_Completed_Cancelled)"
      }
    }
  ],
  "relationships": [
    "Owners ||--o{ Dogs : owns",
    "Dogs ||--|{ Walks : goes",
    "Walkers ||--o{ Walks : conducts",
    "Dogs ||--o{ Reviews : has",
    "Owners ||--o{ Reviews : writes",
    "Owners ||--o{ Bookings : makes",
    "Dogs ||--o{ Bookings : booked",
    "Walks ||--o{ Bookings : part"
  ]
}
```
Use only single words! DO NOT use commas or quotas.
    """


def fetch_database_schema(
    for_who, doing_what, additional_info, make_ai_call, is_mock=False
):
    prompt = (
        for_who_query
        + " "
        + for_who
        + " "
        + doing_what_query
        + " "
        + doing_what
        + " "
        + additional_info
    )
    response = make_ai_call(prompt + " details: " + details, "json")
    return response
