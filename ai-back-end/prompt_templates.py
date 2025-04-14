from langchain import PromptTemplate
def flash_cards_prompt_template(num_flashcards):
    prompt = PromptTemplate(
        template=f"""You are an expert at creating flashcards or question-answer pairs based on a given text. Design the flash cards to test my understanding of the key concepts, facts, and ideas discussed in the text above. Keep each flash card simple and clear, focusing on the most important information. Questions on the front should be specific and unambiguous, helping me recall precise details or concepts. The content generated should be about the core concept of the text and not trivial things.
Generate a total of {num_flashcards} question-answer pairs and each pair seperate it with a new line.

        FORMAT THE OUTPUT LIKE THIS:
        Q1: Where is the Dead Sea located?
        A1: on the border between Israel and Jordan

		Q2: What is the lowest point on the Earth's surface?
        A2: The Dead Sea shoreline

        The text is: \n{{text}}
        """,
        input_variables=["text"],
    )
    return prompt

def course_recommendation_prompt_template():
    prompt = PromptTemplate(
        template=f"""You serve as an AI assistant that recommends courses to the user based on his history of taken courses. Return ONLY the course recommendations to the user. Don't write any extra text, just the course names.

        THE OUTPUT SHOULD BE SEPERATED BY A NEW LINE LIKE THIS:
        artificial intelligence
        machine learning
        data structures and algorithms
        
        The user's taken courses are:
        {{user_courses}}

        Choose MAXIMUM of 3 courses from the following list:
        {{remaining_courses}}

        DO NOT add any extra text, explanations.

        """,
        input_variables=["user_courses", "remaining_courses"]
    )
    return prompt