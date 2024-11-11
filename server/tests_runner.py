from unittest import TestLoader, TextTestRunner, TestSuite

from test.utils.test_mermaid_er_tools import (
    TestParseTableToErdiagramMermaid,
    TestParseRelationshipToErdiagramMermaid,
    TestParseDatabaseToErdiagramMermaid,
)
from test.ai.test_model_enum import (
    TestGetModelRemoteRefEnum,
    TestGetImageModelRemoteRefEnum,
    TestGetTextModelRemoteRefEnum,
)
from test.generation.test_actors import (
    TestFetchActorsFromDatabase,
    TestUpdateActors,
    TestGenerateActorsByAI,
    TestUpdateActorsByAI,
)
from test.generation.test_business_scenarios import (
    TestFetchBusinessScenariosFromDatabase,
    TestUpdateBusinessScenarios,
    TestGenerateBusinessScenariosByAI,
    TestUpdateBusinessScenariosByAI,
)
from test.generation.test_database_schema import (
    TestFetchDatabaseSchemaFromDatabase,
    TestUpdateDatabaseSchema,
    TestGenerateDatabaseSchemaByAI,
    TestUpdateDatabaseSchemaByAI,
)
from test.generation.test_elevator_speech import (
    TestFetchElevatorSpeechFromDatabase,
    TestUpdateElevatorSpeech,
    TestGenerateElevatorSpeechByAI,
    TestUpdateElevatorSpeechByAI,
)
from test.generation.test_logo import (
    TestFetchLogosFromDatabase,
    TestUpdateLogos,
    TestGenerateLogosByAI,
    TestUpdateLogosByAI,
)
from test.generation.test_motto import (
    TestFetchMottoFromDatabase,
    TestUpdateMotto,
    TestGenerateMottoByAI,
    TestUpdateMottoByAI,
)
from test.generation.test_project_schedule import (
    TestFetchProjectScheduleFromDatabase,
    TestUpdateProjectSchedule,
    TestGenerateProjectScheduleByAI,
    TestUpdateProjectScheduleByAI,
)
from test.generation.test_requirements import (
    TestFetchRequirementsFromDatabase,
    TestUpdateRequirements,
    TestGenerateRequirementsByAI,
    TestUpdateRequirementsByAI,
)
from test.generation.test_risks import (
    TestFetchRisksFromDatabase,
    TestUpdateRisks,
    TestGenerateRisksByAI,
    TestUpdateRisksByAI,
)
from test.generation.test_specifications import (
    TestFetchSpecificationsFromDatabase,
    TestUpdateSpecifications,
    TestGenerateSpecificationsByAI,
    TestUpdateSpecificationsByAI,
)
from test.generation.test_strategy import (
    TestFetchStrategyFromDatabase,
    TestUpdateStrategy,
    TestGenerateStrategyByAI,
    TestUpdateStrategyByAI,
)
from test.generation.test_title import (
    TestFetchTitlesFromDatabase,
    TestUpdateTitles,
    TestGenerateTitlesByAI,
    TestUpdateTitlesByAI,
)
from test.generation.test_suggested_technologies import (
    TestFetchSuggestedTechnologiesFromDatabase,
    TestUpdateSuggestedTechnologies,
    TestGenerateSuggestedTechnologiesByAI,
    TestUpdateSuggestedTechnologiesByAI,
)
from test.utils.test_mermaid_class_diagram_tools import (
    TestUmlToMermaidSyntax,
)


if __name__ == "__main__":

    loader = TestLoader()
    tests = [
        loader.loadTestsFromTestCase(test)
        for test in (
            TestParseTableToErdiagramMermaid,
            TestParseRelationshipToErdiagramMermaid,
            TestParseDatabaseToErdiagramMermaid,
            TestGetModelRemoteRefEnum,
            TestGetImageModelRemoteRefEnum,
            TestGetTextModelRemoteRefEnum,
            TestFetchActorsFromDatabase,
            TestUpdateActors,
            TestGenerateActorsByAI,
            TestUpdateActorsByAI,
            TestFetchBusinessScenariosFromDatabase,
            TestUpdateBusinessScenarios,
            TestGenerateBusinessScenariosByAI,
            TestUpdateBusinessScenariosByAI,
            TestFetchDatabaseSchemaFromDatabase,
            TestUpdateDatabaseSchema,
            TestGenerateDatabaseSchemaByAI,
            TestUpdateDatabaseSchemaByAI,
            TestFetchElevatorSpeechFromDatabase,
            TestUpdateElevatorSpeech,
            TestGenerateElevatorSpeechByAI,
            TestUpdateElevatorSpeechByAI,
            TestFetchLogosFromDatabase,
            TestUpdateLogos,
            TestGenerateLogosByAI,
            TestUpdateLogosByAI,
            TestFetchMottoFromDatabase,
            TestUpdateMotto,
            TestGenerateMottoByAI,
            TestUpdateMottoByAI,
            TestFetchProjectScheduleFromDatabase,
            TestUpdateProjectSchedule,
            TestGenerateProjectScheduleByAI,
            TestUpdateProjectScheduleByAI,
            TestFetchRequirementsFromDatabase,
            TestUpdateRequirements,
            TestGenerateRequirementsByAI,
            TestUpdateRequirementsByAI,
            TestFetchRisksFromDatabase,
            TestUpdateRisks,
            TestGenerateRisksByAI,
            TestUpdateRisksByAI,
            TestFetchSpecificationsFromDatabase,
            TestUpdateSpecifications,
            TestGenerateSpecificationsByAI,
            TestUpdateSpecificationsByAI,
            TestFetchStrategyFromDatabase,
            TestUpdateStrategy,
            TestGenerateStrategyByAI,
            TestUpdateStrategyByAI,
            TestFetchTitlesFromDatabase,
            TestUpdateTitles,
            TestGenerateTitlesByAI,
            TestUpdateTitlesByAI,
            TestFetchSuggestedTechnologiesFromDatabase,
            TestUpdateSuggestedTechnologies,
            TestGenerateSuggestedTechnologiesByAI,
            TestUpdateSuggestedTechnologiesByAI,
            TestUmlToMermaidSyntax,
        )
    ]
    suite = TestSuite(tests)

    runner = TextTestRunner(verbosity=2)
    runner.run(suite)
