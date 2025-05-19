from fastapi import APIRouter
from app.models.study import StudyPlanRequest, StudyPlanResponse
from app.controllers.study_controller import generate_study_plan

router = APIRouter()

@router.post("/study-plan", response_model=StudyPlanResponse)
def create_study_plan(request: StudyPlanRequest):
    return generate_study_plan(request)
