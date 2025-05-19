from datetime import datetime, timedelta
from app.models.study import StudyPlanRequest, StudyPlanResponse, DailyTask

def generate_study_plan(request: StudyPlanRequest) -> StudyPlanResponse:
    today = datetime.today().date()
    subjects = sorted(request.subjects, key=lambda s: s.exam_date)

    plan = []
    for subject in subjects:
        days_left = (subject.exam_date.date() - today).days
        if days_left <= 0:
            continue
        chapters = subject.chapters
        hours_per_day = request.daily_hours / len(subjects)
        for i, chapter in enumerate(chapters):
            study_date = today + timedelta(days=i % days_left)
            plan.append(DailyTask(
                date=study_date.isoformat(),
                subject=subject.name,
                chapter=chapter.name,
                hours=round(hours_per_day / len(chapters), 2)
            ))
    return StudyPlanResponse(plan=plan)
