from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List

class File(BaseModel):
    path: str=Field(description="Path to the file to be created or modified")
    purpose: str=Field(description="The purpose of the file, e.g. 'main application logic','data processing module',etc.")


class Plan(BaseModel):
    name: str=Field(description="Name of the app to be built")
    description: str=Field(
        description="Oneline description of the app to be built, e.g. 'A web application for managing personal finances'")
    techstack: str=Field(
        description="Tech stack to be used for the app, e.g. 'python', 'javascript','flask',etc.")
    features: list[str]=Field(
        description="A list of features that the app should have, e.g. 'user authentication','data visualization',etc.")
    files: list[File]=Field(description="A list of files to be created, each with a 'path' and 'purpose'")


class ImplementationTask(BaseModel):
    filepath: str=Field(description="Path to the file to be modified")
    task_description: str=Field(description="Detailed description of the task to be performed on the file, e.g. 'add user authentication function `loginUser()` and integrate it with the existing `AuthService`' ")

class TaskPlan(BaseModel):
    implementation_steps: list[ImplementationTask]=Field(description="A list of steps to be taken that the app should have")
    model_config = ConfigDict(extra="allow")

class CoderState(BaseModel):
    task_plan: TaskPlan= Field(description="The plan for the task to be implemented")
    current_step_idx: int=Field(0,description="The index of the current step in the task")
    current_file_content: Optional[str]=Field(None, description="The content of the file")