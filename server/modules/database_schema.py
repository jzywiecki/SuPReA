import modules.module as modules


database_schema_description_json = """
  "tables": [
    {
      "name": "BOOK",
      "columns": [
        { "name": "id", "type": "int", "primary_key": true },
        { "name": "title", "type": "string" },
        { "name": "author_id", "type": "int", "foreign_key": "AUTHOR.id" },
        { "name": "publication_year", "type": "int" },
        { "name": "ISBN", "type": "string" }
      ]
    },
    {
      "name": "AUTHOR",
      "columns": [
        { "name": "id", "type": "int", "primary_key": true },
        { "name": "first_name", "type": "string" },
        { "name": "last_name", "type": "string" }
      ]
    },
    {
      "name": "READER",
      "columns": [
        { "name": "id", "type": "int", "primary_key": true },
        { "name": "first_name", "type": "string" },
        { "name": "last_name", "type": "string" },
        { "name": "email", "type": "string" }
      ]
    },
    {
      "name": "LOAN",
      "columns": [
        { "name": "id", "type": "int", "primary_key": true },
        { "name": "loan_date", "type": "date" },
        { "name": "return_date", "type": "date" },
        { "name": "book_id", "type": "int", "foreign_key": "BOOK.id" },
        { "name": "reader_id", "type": "int", "foreign_key": "READER.id" }
      ]
    },
    {
      "name": "CATEGORY",
      "columns": [
        { "name": "id", "type": "int", "primary_key": true },
        { "name": "name", "type": "string" }
      ]
    },
    {
      "name": "BOOK_CATEGORY",
      "columns": [
        { "name": "book_id", "type": "int", "foreign_key": "BOOK.id" },
        { "name": "category_id", "type": "int", "foreign_key": "CATEGORY.id" }
      ]
    }
  ],
  "relationships": [
    {
      "from_table": "BOOK",
      "to_table": "AUTHOR",
      "relationship_type": "one-to-one",
      "on_column": "author_id"
    },
    {
      "from_table": "READER",
      "to_table": "LOAN",
      "relationship_type": "one-to-many",
      "on_column": "reader_id"
    },
    {
      "from_table": "BOOK",
      "to_table": "LOAN",
      "relationship_type": "one-to-many",
      "on_column": "book_id"
    },
    {
      "from_table": "BOOK",
      "to_table": "BOOK_CATEGORY",
      "relationship_type": "many-to-many",
      "on_column": "book_id"
    },
    {
      "from_table": "CATEGORY",
      "to_table": "BOOK_CATEGORY",
      "relationship_type": "many-to-many",
      "on_column": "category_id"
    }
  ]
"""
query_for_who = "Generate database schema for "
query_doing_what = "creating app for "
query_expectations = (
    "Generate a new database schema (not the one below), but follow its syntax (don't create new fields in json, etc.). "
    + database_schema_description_json
)


class DatabaseSchemaModule(modules.Module):
    def __init__(self, model):
        self.model = model

    def get_content(self, for_who, doing_what, additional_info, is_mock, **kwargs):
        request = (
            query_for_who
            + " "
            + for_who
            + " "
            + query_doing_what
            + " "
            + doing_what
            + " "
            + query_expectations
            + " "
            + additional_info
        )
        return self.model.generate(request)
