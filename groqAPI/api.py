from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from pypdf import PdfReader

from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq

app = FastAPI(title="IntelliLearn AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

os.environ["GROQ_API_KEY"] = "xxxxxxxxxx"

llm = ChatGroq(
    groq_api_key="xxxxxxxxxxxx",
    model_name="llama-3.1-8b-instant",
    temperature=0.3
)


@app.post("/pdf-yukle")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Sadece PDF dosyaları desteklenir")

    try:
        pdf_reader = PdfReader(file.file)
        full_text = ""
        for page in pdf_reader.pages:
            text = page.extract_text()
            if text:
                full_text += text

        if len(full_text) < 50:
            raise HTTPException(status_code=400, detail="PDF içeriği okunamadı.")

        # Prompt şablonunu daha belirgin hale getirelim
        temp = """
        Sistem Rolü: Sen bir eğitim asistanısın. Verilen metni öğrencilerin çalışabileceği materyallere dönüştürürsün.

        Talimatlar:
        1. Aşağıdaki metni dikkatlice oku.
        2. Metnin akademik bir özetini çıkar.
        3. Metindeki bilgilerden 3 adet çoktan seçmeli (A, B, C, D) soru hazırla.
        4. Metindeki anahtar kavramları içeren 3 adet soru-cevap şeklinde flashcard hazırla.

        Kısıtlamalar:
        - Yanıtı SADECE geçerli bir JSON objesi olarak dön.
        - JSON dışında hiçbir açıklama veya giriş cümlesi (Örn: "İşte hazırladığım sorular...") ekleme.
        - Dil metinle aynı olmalıdır (Türkçe).

        Çıktı Formatı:
        {{
            "summary": "Metnin profesyonel özeti buraya",
            "quizQuestions": [
                {{
                    "question": "Soru metni buraya?",
                    "options": ["A-)", "B-)", "C-)", "D-)"],
                    "answer": "Doğru seçeneğin birebir metni ve seçeneğin sahip olduğu option"
                }}
            ],
            "flashcards": [
                {{
                    "question": "Kavram nedir?",
                    "answer": "Kavramın açıklaması"
                }}
            ]
        }}

        Metin:
        {text}
        """

        prompt = PromptTemplate.from_template(temp)
        chain = prompt | llm

        ai_response = chain.invoke({"text": full_text[:6000]})

        content = ai_response.content
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()

        result_data = json.loads(content)

        return {
            "fileName": file.filename,
            "summary": result_data.get("summary"),
            "quizQuestions": result_data.get("quizQuestions"),
            "flashcards": result_data.get("flashcards")
        }

    except Exception as e:
        print(f"Hata detayı: {str(e)}")
        raise HTTPException(status_code=500, detail=f"İşlem başarısız: {str(e)}")