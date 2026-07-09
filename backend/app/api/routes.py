from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List
from app.core.llm import stream_analysis

router = APIRouter()


class MatrixEntry(BaseModel):
    colA: str
    colB: str
    r: float
    n: int
    xMean: float
    yMean: float
    xStdDev: float
    yStdDev: float


class AnalyzeRequest(BaseModel):
    description: str
    matrix: List[MatrixEntry]


@router.post("/analyze")
async def analyze(request: AnalyzeRequest):
    async def generator():
        async for chunk in stream_analysis(request.model_dump()):
            yield chunk

    return StreamingResponse(generator(), media_type="text/plain")