from langchain_huggingface import HuggingFaceEndpoint
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv(), override=True)
def get_llm_model(repo_id="microsoft/Phi-3-mini-4k-instruct", task="text-generation", max_new_tokens=512, repetition_penalty=1.03, temperature=0.8):
    llm = HuggingFaceEndpoint(
        timeout=600,
        repo_id=repo_id,
        task=task,
        max_new_tokens=max_new_tokens,
        repetition_penalty=repetition_penalty,
        temperature=temperature

    )
    return llm
