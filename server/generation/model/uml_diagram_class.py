"""
This module is responsible for generating a uml schema.
"""

from generation.generate import Generate
from models import ComponentIdentify
from models import UMLDiagramClasses


expected_format = """ Don't return the same values in the uml_diagram_class! just be inspired by it!
  "uml_diagram_class": [
    {
      "name": "string",
      "attributes": [
        {
          "name": "string",
          "type": "string"
        }
      ],
      "methods": [
            {
            "name": "string",
            "return_type": "string"
            }
      ],
      "relationships": [
        {
          "target": "string",  (value should be the name of other uml the class)
          "type": "string" (possible values: "inheritance", "dependency", "association", "aggregation", 
          "composition", "realization", "interface")
        }
      ],
    ]
  ]
"""


class UMLDiagramClassesGenerate(Generate):
    """
    A concrete implementation of the Generate class for generating and updating uml_diagram_class models.
    """

    def __init__(self):
        """
        Initializes the `UMLsGenerate` instance.
        """
        super().__init__(
            UMLDiagramClasses,
            "uml diagram class",
            expected_format,
            ComponentIdentify.UML_DIAGRAM_CLASS,
        )
