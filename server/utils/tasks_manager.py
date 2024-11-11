import ray
from utils import logger


@ray.remote
class RemoteTasksManager:
    """
    This class manages a queue of remote tasks and ensures that no more than a
    specified number of tasks are running concurrently. If the limit is reached,
    it waits for a task to finish before adding a new one.
    """

    def __init__(self, max_tasks):
        self.task_queue = []
        self.max_tasks = max_tasks

    def add_remote_task(self, task, *args):
        try:
            if len(self.task_queue) >= self.max_tasks:
                _, self.task_queue = ray.wait(self.task_queue, num_returns=1)
            new_remote_task = task(*args)
            self.task_queue.append(new_remote_task)
            return new_remote_task
        except Exception as e:
            logger.error(f"Error adding remote task: {e}")
            return None
