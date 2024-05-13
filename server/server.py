import asyncio

# this is main server file where imports from each modules will be made and called upon server start
import modules.actorsModule.routes as actors
import utils.openaiUtils as utils 

if __name__ == "__main__":
    actors = actors.ActorsModule(utils.Model.GPT3)
    
    loop = asyncio.get_event_loop()
    loop.run_until_complete(actors.get_content("systemu", "tworzenia aplikacji"))
