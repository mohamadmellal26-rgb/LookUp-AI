import os
import shutil
import urllib.parse
import re
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from deepface import DeepFace
from duckduckgo_search import DDGS

app = FastAPI(title="LookUp AI Backend", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchResult(BaseModel):
    platform: str
    title: str
    url: str

class AnalysisResponse(BaseModel):
    status: str
    extracted_text: str
    social_results: List[SearchResult]

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_image(image: UploadFile = File(...)):
    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, image.filename)
    
    try:
        contents = await image.read()
        with open(file_path, "wb") as f:
            f.write(contents)

        # تحليل الوجه بالذكاء الاصطناعي واستخراج الملامح أو اسم الشخص من الـ dataset
        extracted_context = analyze_face_with_ai(file_path)

        if os.path.exists(file_path):
            os.remove(file_path)

        # ترميز الاستعلام للـ URLs
        encoded_query = urllib.parse.quote(extracted_context)

        # بناء روابط بحث مباشرة ومضمونة لجميع منصات التواصل الاجتماعي
        social_results = [
            SearchResult(
                platform="YouTube",
                title=f"Search YouTube videos & channels for '{extracted_context}'",
                url=f"https://www.youtube.com/results?search_query={encoded_query}"
            ),
            SearchResult(
                platform="Facebook",
                title=f"Search Facebook profiles & public posts for '{extracted_context}'",
                url=f"https://www.facebook.com/search/top?q={encoded_query}"
            ),
            SearchResult(
                platform="Instagram",
                title=f"Search Instagram accounts & tags for '{extracted_context}'",
                url=f"https://www.instagram.com/explore/tags/{urllib.parse.quote(extracted_context.replace(' ', ''))}/"
            ),
            SearchResult(
                platform="Twitter / X",
                title=f"Search Twitter posts & accounts for '{extracted_context}'",
                url=f"https://twitter.com/search?q={encoded_query}&f=user"
            ),
            SearchResult(
                platform="TikTok",
                title=f"Search TikTok profiles & creators for '{extracted_context}'",
                url=f"https://www.tiktok.com/search/user?q={encoded_query}"
            ),
            SearchResult(
                platform="LinkedIn",
                title=f"Search LinkedIn professional profiles for '{extracted_context}'",
                url=f"https://www.linkedin.com/search/results/people/?keywords={encoded_query}"
            ),
            SearchResult(
                platform="Google Visual Images",
                title=f"Reverse & visual facial match search for '{extracted_context}'",
                url=f"https://www.google.com/search?q={encoded_query}&tbm=isch"
            )
        ]

        # محاولة جلب نتائج إضافية حقيقية من الويب عبر DuckDuckGo وإضافتها
        try:
            with DDGS() as ddgs:
                general_results = list(ddgs.text(extracted_context, max_results=2))
                for r in general_results:
                    social_results.append(SearchResult(
                        platform="Web Match",
                        title=r.get("title", "Web Result"),
                        url=r.get("href", "#")
                    ))
        except Exception as e:
            print(f"Web search error: {e}")

        return AnalysisResponse(
            status="success",
            extracted_text=f"AI Facial Match / Traits: {extracted_context}",
            social_results=social_results
        )

    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
            
        raise HTTPException(
            status_code=400, 
            detail=f"Analysis failed or no valid face detected: {str(e)}"
        )

def analyze_face_with_ai(file_path: str) -> str:
    try:
        # البحث في مجلد الـ dataset محلياً عن مطابقة للصورة (مثل اسم الشخص)
        dataset_path = "dataset"
        if os.path.exists(dataset_path) and os.listdir(dataset_path):
            dfs = DeepFace.find(
                img_path=file_path, 
                db_path=dataset_path, 
                enforce_detection=False,
                silent=True
            )
            if len(dfs) > 0 and not dfs[0].empty:
                matched_image_path = dfs[0]['identity'].iloc[0]
                filename = os.path.splitext(os.path.basename(matched_image_path))[0]
                
                # تنظيف الاسم وحذف الأرقام الزائدة مثل _1 أو _2 لجعل الاسم نظيفاً
                person_name = re.sub(r'(_\d+)+$', '', filename)
                return person_name.replace("_", " ")

        # إذا لم يوجد تطابق في الـ dataset، نلجأ للتحليل العام للسمات
        analysis = DeepFace.analyze(
            img_path=file_path, 
            actions=['gender', 'emotion'], 
            enforce_detection=True
        )
        
        if isinstance(analysis, list):
            analysis0 = analysis[0]
        else:
            analysis0 = analysis
            
        gender = analysis0.get('dominant_gender', 'Person')
        emotion = analysis0.get('dominant_emotion', '')
        
        return f"{gender} {emotion}"
        
    except Exception as e:
        print(f"Analysis/Recognition error: {e}")
        return "Person Profile"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)