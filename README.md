# SuPReA - system supporting project requirements analysis
AI supported system for creating project requirements analysis and crafting blueprint for development

# Setup:
#### Install docker and docker compose

#### Set all of the below environment variables, suggested settings are below
```
DOCKER_COMPOSE_CONFIG = TRUE
2 AI_ID=651ffd7ac0f14c3aaf123456
3 SERVER_URL="http://localhost:8000"
4 JWT_SECRET=secret
5 MONGODB_URL=<mongodb-atlas-url>
6 DATABASE_NAME=Projects
7 OPENAI_API_KEY=<open-ai-api-key>
8 REALTIME_SERVER_URL=http://localhost:3000 
```

#### Run containers using docker compose
```
docker compose up
```
