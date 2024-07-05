# AI supported system for creating project requirements analysis and crafting blueprint for development

# Setup:
#### Install python: https://www.python.org/downloads/windows/
#### It is recommended to use venv
#### Install required libraries: `pip install -r requirements.txt`
#### Setup your OpenAI API key and set is as environment variable: https://platform.openai.com/docs/quickstart 
#### Set MONGODB_URL environment variable (you can generate the URL using mongo atlas)
#### Run in ./server:	`fastapi dev main.py`

#### Run in ./client: `npm install`
#### Run in ./client: `npm run dev`

#  Libraries:
### Making requests to OpenAI api: openai 1.28.1:
#### https://pypi.org/project/openai/

### Creating UML visualisation: plantuml 0.3.0: 
#### https://pypi.org/project/plantuml/

### Validating data: jsonschema 4.22.0:
#### https://pypi.org/project/jsonschema/

### Using webtools: selenium 4.20.0
#### https://pypi.org/project/selenium/
#### WebDriver: https://googlechromelabs.github.io/chrome-for-testing/#stable

# Project structure: <br>
 <pre>
    Server/
    │
    ├── modules/
    │   ├── data/
    │   │   # data for testing models
    │   ├── fetch.py
    │   │   # function/s that will send request to required model
    │   ├── routes.py
    │   │   # main functions of module (e.g., fetchUML, fetchUMLinFormat)
    │   └── util.py
    │       # utils regarding specific module
    │
    ├── routes/
    │   # route definitions for the server
    │
    └── utils/
        # main utils for server
  </pre>





