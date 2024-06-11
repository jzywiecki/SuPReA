import os
import re
import uuid
import logging
from server.utils.data import write_to_file

logger = logging.getLogger("database_schema")
dirname =  os.path.dirname(__file__)

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

def save_schema_as_png(mermaid_code, path, chromedriverpath):
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    </head>
    <body>
        <div class="mermaid">
            {mermaid_code}
        </div>
        <script>
            mermaid.initialize({{ startOnLoad: true }});
        </script>
    </body>
    </html>
    """
    file = os.path.join(dirname,path, "database_diagram.html")
    with open(os.path.abspath(file), "w", encoding='utf8') as file:
        file.write(html_content)

    options = Options()
    options.add_argument("--headless")
    cService = webdriver.ChromeService(executable_path= chromedriverpath)
    driver = webdriver.Chrome(service = cService, options=options)
    filePath = os.path.join(dirname,path, "database_diagram.html")
    driver.get("file:"+os.path.abspath(filePath))

    wait = WebDriverWait(driver, 10)
    wait.until(EC.presence_of_element_located((By.CLASS_NAME, "mermaid")))

    driver.save_screenshot(os.path.join(dirname,path,"database_diagram.png"))
    driver.quit()


def extract_schema_from_messeage(message):
    pattern = re.compile(r'mermaid_erDiagram(.*?)```', re.DOTALL)
    match = pattern.findall(message)
    if match:
        return match[0]
    else:
        logger.error(f'Database schema regex [mermaid_erDiagram(.*?)```] not found in the message: {message}')

def save_schema(data, chromedriverpath):
    random_uuid = uuid.uuid4()
    path = os.path.join(dirname,'data','gen',str(random_uuid))
    os.mkdir(path)
    write_to_file(os.path.join(path,'database_schema.txt'), str(data))
    save_schema_as_png(data, path, chromedriverpath)

def json_to_mermaid(json_data):
    mermaid_code = ""
    for entity in json_data['schema']:
        for entity_name, attributes in entity.items():
            mermaid_code += f"    {entity_name} {{\n"
            for attribute, datatype in attributes.items():
                mermaid_code += f"        {attribute} {datatype}\n"
            mermaid_code += "    }\n\n"

    for relationship in json_data['relationships']:
        entity1, rest = relationship.split(' ', 1)
        connector, entity2, label = rest.split(' ', 2)
        connector = connector.replace("o", "|")
        mermaid_code += f"    {entity1} {connector} {entity2}  {label}\n"

    return "erDiagram"+mermaid_code