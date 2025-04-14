import os
from langchain.document_loaders import PyPDFLoader
def load_document(file):
    name, extension = os.path.splitext(file)
    if extension == ".pdf":
        print(f"Loading {file}")
        loader = PyPDFLoader(file)
    else:
        print("Document format is not supported!")
        return None
    data = loader.load()
    return data

def format_document(data):
    text = ""
    loaded_document = load_document(data)
    for i in range(len(loaded_document)):
        text += loaded_document[i].page_content[:]
    return text