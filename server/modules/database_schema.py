import ray
import json

import modules.module as modules
from models import DatabaseSchema
from utils.decorators import override
from modules.module import extract_json

expected_format = """ Don't return the same values in the database! just be inspired by it!
  "tables": [
    {
      "name": "string",
      "columns": [
        { "name": "string", 
          "type": "string", (int, date, string, boolean)
          "primary_key": "boolean" (true, false),
           "foreign_key": "string"  (foreign key to another table (e.g. book_id) OR null)
        },
      ]
  ],
  "relationships": [
    {
      "from_table": "string",
      "to_table": "string",
      "relationship_type": "string", (one-to-one, one-to-many, many-to-many)
      "on_column": "string"
    }
  ]
"""


@ray.remote
class DatabaseSchemaModule(modules.Module):
    def __init__(self):
        super().__init__(DatabaseSchema, "database_schema", expected_format)

    @override
    def update_by_ai(self, ai_model, changes_request):
        try:
            json_val_format = json.dumps(self.value, default=lambda x: x.__dict__)
            request = ai_model.parse_update_query(self.name, json_val_format, changes_request, self.expected_format)

            reply = ai_model.make_ai_call(request)
            reply_json_str = extract_json(reply)
            self.value = super(DatabaseSchemaModule, self).make_model_from_reply(reply_json_str)

        except Exception as e:
            print(e)
            self.exception = e
            self.status = f"model:{self.name} error:update_by_ai"
