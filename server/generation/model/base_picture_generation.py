import ray
from generation.generate import Generate
from models import Picture
from utils.decorators import override
from utils import is_valid_url
from utils.fetch import fetch_image_bytes_task
from database import ProjectDAO
from database import get_picture_dao_ref
from pymongo.results import UpdateResult


class BasePictureGeneration(Generate):
    """
    Base class for image generation
    """

    def __init__(self, model_class, what, expected_format, identify, width, height):
        """
        Initializes the BasePictureGeneration instance with specific image settings.

        :param model_class: The model class related to this generation instance.
        :param what: A description or identifier for the type of generation.
        :param expected_format: The format that the generated images should follow.
        :param identify: An identifier for the component.
        :param width: The target width for images.
        :param height: The target height for images.
        """
        super().__init__(model_class, what, expected_format, identify)
        self.width = width
        self.height = height

    @override
    def save_to_database(
        self, project_dao: ProjectDAO, project_id: str
    ) -> UpdateResult:
        """
        Asynchronously downloads images from validated URLs, resizes them, and saves
        them in the database, replacing the original URLs with database references.

        :param project_dao: The DAO for accessing project data in the database.
        :type project_dao: ProjectDAO
        :param project_id: The ID of the project for which images are generated.
        :type project_id: str

        :return: The result of the database update operation.
        :rtype: UpdateResult

        :raises ValueError: If no valid URLs are found in the input.
        """
        fetch_images_tasks = []
        picture_dao = get_picture_dao_ref()
        valid_urls = [url for url in self.value.urls if is_valid_url(url)]

        if not valid_urls:
            raise ValueError("No valid URLs found in picture URLs.")

        for url in valid_urls:
            fetch_images_tasks.append(
                fetch_image_bytes_task.remote(url, self.width, self.height)
            )

        self.value.urls.clear()

        for task in fetch_images_tasks:
            image_data = ray.get(task)
            if image_data is not None:
                picture = Picture(data=image_data)
                picture_id = picture_dao.save_picture(picture)
                self.value.urls.append(picture_id)

        return project_dao.update_project_component(
            project_id, self.component_identify.value, self.value
        )
