import json

import modules.module as modules


query_for_who = "Make logo for "
query_doing_what = "creating app for "

additional_details1 = " The logo should be simple and colorful. The whole background should be white. The image is a single logo with no additional content. "
additional_details2 = " The logo should be simple and not colorful. The whole background should be white. Don't put additional content on picture instead of logo. The image is a single logo with no additional content. "
additional_details3 = " The logo should be for children. The whole background should be white. Don't put additional content on picture instead of logo. The image is a single logo with no additional content. "
additional_details4 = " The logo should be funny. The whole background should be white. Don't put additional content on picture instead of logo. The image is a single logo with no additional content. "


class LogoModule(modules.Module):
    def __init__(self, model):
        self.model = model

    def make_query(self, for_who, doing_what, additional_info, details):
        request = (
                query_for_who
                + " "
                + for_who
                + " "
                + query_doing_what
                + " "
                + doing_what
                + " "
                + details
                + " "
                + additional_info
        )
        return self.model.generate(request)

    def get_content(self, for_who, doing_what, additional_info, is_mock, **kwargs):
        tasks = [
            self.make_query(for_who, doing_what, additional_info, additional_details1),
            self.make_query(for_who, doing_what, additional_info, additional_details2),
            #self.make_query(for_who, doing_what, additional_info, additional_details3),
            #self.make_query(for_who, doing_what, additional_info, additional_details4)
        ]

        content = json.dumps({"logo_urls": tasks})

        return content


