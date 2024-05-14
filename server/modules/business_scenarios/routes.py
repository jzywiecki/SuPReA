
# async def fetch_business(is_mock=False):
#     try:
#         schema = '''
#             {
#                 "business_scenario": {
#                     "title": "....",
#                     "description": "....",
#                     "features": [
#                         {"feature_name": "...", "description": "..."},
#                         {"feature_name": "...", "description": "..."}
#                     ]
#                 }
#             }
#         '''
#         diagrams_query = f"I am planning an IT startup focusing on a dog walking app. Generate business scenarios: {schema}"
        
#         text_response_for_uml_diagrams_list = '{}' if is_mock else await make_ai_call(diagrams_query, {"type": "json_object"})
        
#         diagrams_list_json = json.loads(text_response_for_uml_diagrams_list)
#         return diagrams_list_json
    
#     except (json.JSONDecodeError, Exception) as e:
#         logger.error(f"Error occurred while fetching business scenarios: {e}")
#         raise Exception(f"Error occurred while fetching business scenarios: {e}")



# async def generate_business(is_mock=True):
#     try:
#         business_list_json = await fetch_business(is_mock)
#         return business_list_json
#     except Exception as e:
#         logger.error(f"Error generating business data: {e}")
#         raise Exception(f"Error generating business data: {e}")
