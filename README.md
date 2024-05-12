# AI supported system for creating project requirements analysis and crafting blueprint for development

# Setup:
#### Install python: https://www.python.org/downloads/windows/
#### Install required libraries: `pip install -r requirements.txt`
#### Setup your OpenAI API key: https://platform.openai.com/docs/quickstart
#### Run in ./server:	`python server.py`

#  Libraries:
### Making requests to OpenAI api: openai 1.28.1:
#### https://pypi.org/project/openai/

### Creating UML visualisation: plantuml 0.3.0: 
#### https://pypi.org/project/plantuml/

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





