import os
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse
from tempfile import NamedTemporaryFile
import uvicorn
from text_generation_utils import get_flashcards, get_recommended_courses
from request_models import CourseRecommendationRequst

app = FastAPI()

@app.post("/")
async def generate_flashcards(file: UploadFile = File(...), num_flashcards: int = Form(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Files must be uploaded only in PDF format.")
    
    with NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_file.write(await file.read())
        temp_file.flush()
        temp_path = temp_file.name
        question_answer_pairs = await get_flashcards(file=temp_path, num_flashcards=num_flashcards)
    os.remove(temp_path)

    return JSONResponse(content={"question_answer_pairs": question_answer_pairs})

@app.post("/recommend_courses")
async def recommend_courses(request: CourseRecommendationRequst):
    # taken_courses_str = "\n".join(request.taken_courses)
    # remaining_courses_str = "\n".join(request.remaining_courses)
    taken_courses_str = "\n".join(["Algorithms and data structures", "Databases", "Object oriented programming"])
    remaining_courses_str = "\n".join(["Machine learning", "Calculus", "Biology 1", "Astronomy", "Physics", "Statistics"])
    recommended_courses = await get_recommended_courses(user_courses=taken_courses_str, remaining_courses=remaining_courses_str)
    print(recommended_courses)
    return JSONResponse(content={"recommended_courses": recommended_courses})


if __name__ == "__main__":
    uvicorn.run("app:app", host="localhost", port=8080, reload=True)