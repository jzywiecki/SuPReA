import unittest
from utils.mermaid_class_diagram_tools import uml_to_mermaid_syntax


class TestUmlToMermaidSyntax(unittest.TestCase):

    def test_basic_conversion(self):
        uml_diagram_class = {
            "uml_diagram_class": [
                {
                    "name": "User",
                    "attributes": [
                        {"name": "id", "type": "int"},
                        {"name": "name", "type": "string"},
                    ],
                    "methods": [
                        {"name": "getId", "return_type": "int"},
                        {"name": "setName", "return_type": "void"},
                    ],
                    "relationships": [{"type": "association", "target": "Order"}],
                },
                {
                    "name": "Order",
                    "attributes": [{"name": "orderId", "type": "int"}],
                    "methods": [{"name": "calculateTotal", "return_type": "float"}],
                    "relationships": [],
                },
            ]
        }
        expected_result = (
            "classDiagram\n"
            "    class User {\n"
            "        +int id\n"
            "        +string name\n"
            "        +int getId()\n"
            "        +void setName()\n"
            "    }\n"
            "    User -- Order\n"
            "    class Order {\n"
            "        +int orderId\n"
            "        +float calculateTotal()\n"
            "    }\n"
        )
        self.assertEqual(uml_to_mermaid_syntax(uml_diagram_class), expected_result)

    def test_inheritance_relationship(self):
        uml_diagram_class = {
            "uml_diagram_class": [
                {
                    "name": "Admin",
                    "attributes": [{"name": "level", "type": "int"}],
                    "methods": [{"name": "manageUsers", "return_type": "void"}],
                    "relationships": [{"type": "inheritance", "target": "User"}],
                },
                {
                    "name": "User",
                    "attributes": [
                        {"name": "id", "type": "int"},
                        {"name": "name", "type": "string"},
                    ],
                    "methods": [{"name": "getId", "return_type": "int"}],
                    "relationships": [],
                },
            ]
        }
        expected_result = (
            "classDiagram\n"
            "    class Admin {\n"
            "        +int level\n"
            "        +void manageUsers()\n"
            "    }\n"
            "    Admin <|-- User\n"
            "    class User {\n"
            "        +int id\n"
            "        +string name\n"
            "        +int getId()\n"
            "    }\n"
        )
        self.assertEqual(uml_to_mermaid_syntax(uml_diagram_class), expected_result)

    def test_invalid_input_should_raise_key_error(self):
        uml_diagram_class = {
            "uml_diagram_class": [
                {
                    "name": "User",
                    "attributes": [{"name": "id", "type": "int"}],
                    "methods": [{"name": "getId", "return_type": "int"}],
                    "relationships": [
                        {"type": "association", "target invalid": "Order"}
                    ],
                }
            ]
        }
        with self.assertRaises(KeyError):
            uml_to_mermaid_syntax(uml_diagram_class)

    def test_invalid_input_type_should_raise_type_error(self):
        uml_diagram_class = []
        with self.assertRaises(TypeError):
            uml_to_mermaid_syntax(uml_diagram_class)

    def test_multiple_relationships(self):
        """Test a class with multiple relationship types (association, dependency, and aggregation)."""
        uml_diagram_class = {
            "uml_diagram_class": [
                {
                    "name": "Customer",
                    "attributes": [{"name": "customerId", "type": "int"}],
                    "methods": [{"name": "getCustomerId", "return_type": "int"}],
                    "relationships": [
                        {"type": "association", "target": "Order"},
                        {"type": "dependency", "target": "Invoice"},
                        {"type": "aggregation", "target": "Address"},
                    ],
                }
            ]
        }
        expected_result = (
            "classDiagram\n"
            "    class Customer {\n"
            "        +int customerId\n"
            "        +int getCustomerId()\n"
            "    }\n"
            "    Customer -- Order\n"
            "    Customer --> Invoice\n"
            "    Customer o-- Address\n"
        )
        self.assertEqual(uml_to_mermaid_syntax(uml_diagram_class), expected_result)

    def test_interface_implementation(self):
        """Test a class implementing an interface."""
        uml_diagram_class = {
            "uml_diagram_class": [
                {
                    "name": "User",
                    "attributes": [{"name": "userId", "type": "int"}],
                    "methods": [{"name": "getUserId", "return_type": "int"}],
                    "relationships": [{"type": "interface", "target": "Authenticable"}],
                }
            ]
        }
        expected_result = (
            "classDiagram\n"
            "    class User {\n"
            "        +int userId\n"
            "        +int getUserId()\n"
            "    }\n"
            "    class Authenticable {\n"
            "        <<interface>>\n"
            "    }\n"
            "    User ..|> Authenticable : implements\n"
        )
        self.assertEqual(uml_to_mermaid_syntax(uml_diagram_class), expected_result)

    def test_empty_class_attributes_methods(self):
        """Test a class with no attributes or methods."""
        uml_diagram_class = {
            "uml_diagram_class": [
                {
                    "name": "EmptyClass",
                    "attributes": [],
                    "methods": [],
                    "relationships": [],
                }
            ]
        }
        expected_result = "classDiagram\n" "    class EmptyClass {\n" "    }\n"
        self.assertEqual(uml_to_mermaid_syntax(uml_diagram_class), expected_result)

    def test_no_relationships(self):
        """Test multiple classes with no relationships."""
        uml_diagram_class = {
            "uml_diagram_class": [
                {
                    "name": "Person",
                    "attributes": [{"name": "name", "type": "string"}],
                    "methods": [{"name": "getName", "return_type": "string"}],
                    "relationships": [],
                },
                {
                    "name": "Address",
                    "attributes": [{"name": "street", "type": "string"}],
                    "methods": [{"name": "getStreet", "return_type": "string"}],
                    "relationships": [],
                },
            ]
        }
        expected_result = (
            "classDiagram\n"
            "    class Person {\n"
            "        +string name\n"
            "        +string getName()\n"
            "    }\n"
            "    class Address {\n"
            "        +string street\n"
            "        +string getStreet()\n"
            "    }\n"
        )
        self.assertEqual(uml_to_mermaid_syntax(uml_diagram_class), expected_result)

    def test_invalid_relationship_type_should_ignore(self):
        """Test that an invalid relationship type is ignored."""
        uml_diagram_class = {
            "uml_diagram_class": [
                {
                    "name": "Customer",
                    "attributes": [{"name": "customerId", "type": "int"}],
                    "methods": [{"name": "getCustomerId", "return_type": "int"}],
                    "relationships": [
                        {"type": "association", "target": "Order"},
                        {"type": "invalid_type", "target": "Invoice"},
                    ],
                }
            ]
        }
        expected_result = (
            "classDiagram\n"
            "    class Customer {\n"
            "        +int customerId\n"
            "        +int getCustomerId()\n"
            "    }\n"
            "    Customer -- Order\n"
        )
        self.assertEqual(uml_to_mermaid_syntax(uml_diagram_class), expected_result)
