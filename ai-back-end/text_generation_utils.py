from dotenv import load_dotenv, find_dotenv
from prompt_templates import *
from langchain.chains import LLMChain
from models import get_llm_model
from document_loader import format_document
import asyncio
import re
load_dotenv(find_dotenv(), override=True)

async def get_recommended_courses(user_courses, remaining_courses):
    llm = get_llm_model(repo_id="deepseek-ai/DeepSeek-R1-Distill-Qwen-32B")
    prompt = course_recommendation_prompt_template()
    qa_chain = LLMChain(prompt=prompt, llm=llm)
    answer = await qa_chain.ainvoke({"user_courses": user_courses, "remaining_courses": remaining_courses})
    answer = format_course_recommendation_answer(answer['text'])
    return answer

async def get_flashcards(num_flashcards, file):
    llm = get_llm_model(repo_id="mistralai/Mistral-7B-Instruct-v0.2")
    prompt = flash_cards_prompt_template(num_flashcards)
    qa_chain = LLMChain(prompt=prompt, llm=llm)
    text = await asyncio.to_thread(format_document, file)
    answer = await qa_chain.ainvoke({"text": text})
    answer = answer['text']
    answer = format_flashcard_answer(answer, num_flashcards)
    return answer

def format_flashcard_answer(answer):
    print(answer)
    split_text = answer.split("\n")
    print(split_text)
    split_text = [s.strip() for s in split_text if s.strip()]
    print(split_text)
    start_index = None
    for i, x in enumerate(split_text):
        if x.startswith("Q1:"):
            start_index = i
            break
    if start_index is not None:
        split_text = split_text[start_index:]
    pairs = []
    pair_counter = 1
    for i in range(0, len(split_text) - 1, 2):
        q = re.split(r"Q\d:\s*", split_text[i])[1].strip()
        a = re.split(r"A\d:\s*", split_text[i+1])[1].strip()
        pairs.append({
             f"Question {pair_counter}": q,
             f"Answer {pair_counter}": a
         })
        pair_counter += 1
    print(pairs)
    return pairs

def format_course_recommendation_answer(answer):
    courses_whitespace = answer.split("</think>")[1]
    print(courses_whitespace)
    courses = [c.strip() for c in courses_whitespace.split("\n") if c.strip()]
    print(courses)
    return courses

