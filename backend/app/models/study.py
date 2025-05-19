from pydantic import BaseModel
from typing import List
from datetime import datetime

class Chapter(BaseModel):
    name: str

class Subject(BaseModel):
    name: str
    chapters: List[Chapter]
    exam_date: datetime

class StudyPlanRequest(BaseModel):
    subjects: List[Subject]
    daily_hours: int

class DailyTask(BaseModel):
    date: str
    subject: str
    chapter: str
    hours: float

class StudyPlanResponse(BaseModel):
    plan: List[DailyTask]
