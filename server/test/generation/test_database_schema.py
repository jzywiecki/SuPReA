import unittest
import json
from models import DatabaseSchema, Column, Table, Relationship
from generation.model.database_schema import DatabaseSchemaGenerate

from .base import BaseTestFetchValueFromDatabase
from .base import BaseTestUpdate
from .base import BaseTestGenerateByAI
from .base import BaseTestUpdateByAI


# Test data ===================================================
correct_data = {
    "tables": [
        {
            "name": "actor",
            "columns": [
                {
                    "name": "name",
                    "type": "VARCHAR",
                    "primary_key": True,
                    "foreign_key": None,
                },
                {
                    "name": "description",
                    "type": "TEXT",
                    "primary_key": False,
                    "foreign_key": None,
                },
                {
                    "name": "film",
                    "type": "VARCHAR",
                    "primary_key": False,
                    "foreign_key": "film.name",
                },
            ],
        },
        {
            "name": "film",
            "columns": [
                {
                    "name": "name",
                    "type": "VARCHAR",
                    "primary_key": True,
                    "foreign_key": None,
                },
                {
                    "name": "description",
                    "type": "TEXT",
                    "primary_key": False,
                    "foreign_key": None,
                },
            ],
        },
    ],
    "relationships": [
        {
            "from_table": "actor",
            "to_table": "film",
            "relationship_type": "one_to_many",
            "on_column": "name",
        }
    ],
}

invalid_data = {
    "tables INVALID": [
        {
            "name": "actor",
            "columns": [
                {
                    "name": "name",
                    "type": "VARCHAR",
                    "primary_key": True,
                    "foreign_key": None,
                },
                {
                    "name": "description",
                    "type": "TEXT",
                    "primary_key": False,
                    "foreign_key": None,
                },
            ],
        }
    ],
    "relationships": [
        {
            "from_table": "actor",
            "to_table": "film",
            "relationship_type": "one_to_many",
            "on_column": "name",
        }
    ],
}

invalid_format = "tables: [Table] relationships: [Relationship]"

table_one = Table(
    name="actor",
    columns=[
        Column(name="name", type="VARCHAR", primary_key=True, foreign_key=None),
        Column(name="description", type="TEXT", primary_key=False, foreign_key=None),
        Column(name="film", type="VARCHAR", primary_key=False, foreign_key="film.name"),
    ],
)

table_two = Table(
    name="film",
    columns=[
        Column(name="name", type="VARCHAR", primary_key=True, foreign_key=None),
        Column(name="description", type="TEXT", primary_key=False, foreign_key=None),
    ],
)

relationship_one = Relationship(
    from_table="actor",
    to_table="film",
    relationship_type="one_to_many",
    on_column="name",
)

table_three = Table(
    name="invoices",
    columns=[
        Column(name="id", type="INTEGER", primary_key=True, foreign_key=None),
    ],
)

database_schema_one = DatabaseSchema(
    tables=[table_one, table_two], relationships=[relationship_one]
)

database_schema_two = DatabaseSchema(tables=[table_three], relationships=[])
# ============================================================


class TestFetchDatabaseSchemaFromDatabase(
    BaseTestFetchValueFromDatabase, unittest.TestCase
):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = DatabaseSchemaGenerate
        self.correct_data_from_db = correct_data
        self.invalid_data_from_db = invalid_data
        self.expected_value = database_schema_one


class TestUpdateDatabaseSchema(BaseTestUpdate, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = DatabaseSchemaGenerate
        self.expected_value = database_schema_one


class TestGenerateDatabaseSchemaByAI(BaseTestGenerateByAI, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = DatabaseSchemaGenerate
        self.correct_generated_data = json.dumps(correct_data)
        self.expected_value = database_schema_one
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)


class TestUpdateDatabaseSchemaByAI(BaseTestUpdateByAI, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = DatabaseSchemaGenerate
        self.prev_expected_value = database_schema_two
        self.expected_value = database_schema_one
        self.correct_generated_data = json.dumps(correct_data)
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)


if __name__ == "__main__":
    unittest.main()
