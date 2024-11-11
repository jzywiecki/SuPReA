from utils import logger


def uml_to_mermaid_syntax(umls: dict) -> str:
    """
    Converts a dictionary representation of a UML class diagram into a Mermaid syntax string.

    Args:
        umls (dict): A dictionary containing UML class diagram elements, including classes,
                     attributes, methods, and relationships.

    Returns:
        str: A Mermaid syntax string representing the UML class diagram.
    """
    mermaid_diagram = "classDiagram\n"

    for uml in umls["uml_diagram_class"]:
        mermaid_diagram += f"    class {uml['name']} {{\n"

        for attribute in uml["attributes"]:
            mermaid_diagram += f"        +{attribute['type']} {attribute['name']}\n"

        for method in uml["methods"]:
            mermaid_diagram += f"        +{method['return_type']} {method['name']}()\n"

        mermaid_diagram += "    }\n"

        for relationship in uml["relationships"]:
            relationship_type = relationship["type"]
            target = relationship["target"]
            class_name = uml["name"]

            if relationship_type == "inheritance":
                mermaid_diagram += f"    {class_name} <|-- {target}\n"
            elif relationship_type == "dependency":
                mermaid_diagram += f"    {class_name} --> {target}\n"
            elif relationship_type == "association":
                mermaid_diagram += f"    {class_name} -- {target}\n"
            elif relationship_type == "aggregation":
                mermaid_diagram += f"    {class_name} o-- {target}\n"
            elif relationship_type == "composition":
                mermaid_diagram += f"    {class_name} *-- {target}\n"
            elif relationship_type == "realization":
                mermaid_diagram += f"    {class_name} ..|> {target}\n"
            elif relationship_type == "interface":
                mermaid_diagram += (
                    f"    class {target} {{\n        <<interface>>\n    }}\n"
                )
                mermaid_diagram += f"    {class_name} ..|> {target} : implements\n"

    return mermaid_diagram


def create_uml_class_diagram_mermaid(umls: dict) -> str | None:
    """
    Generates a Mermaid syntax UML class diagram from a UML dictionary, with error handling.

    Args:
        umls (dict): A dictionary representing UML class diagram data.

    Returns:
        str | None: A Mermaid syntax string if the conversion is successful, or None if
                    an error occurs (logged for debugging).
    """
    try:
        return uml_to_mermaid_syntax(umls)
    except Exception as e:
        logger.exception(f"{e}")
        return None
