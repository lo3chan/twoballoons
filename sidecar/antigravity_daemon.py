import asyncio
import json
import os
import sys
from typing import AsyncGenerator, Dict, Any, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

# Try importing official google.antigravity SDK with graceful fallback
try:
    from google.antigravity import Agent, LocalAgentConfig, CapabilitiesConfig
    ANTIGRAVITY_SDK_AVAILABLE = True
except ImportError:
    ANTIGRAVITY_SDK_AVAILABLE = False

app = FastAPI(
    title="twoballoons Antigravity Sidecar Service",
    description="Python sidecar API daemon for real-time spatial generative fill and reasoning streaming",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SYSTEM_INSTRUCTIONS = """
You are the generative AI logic engine for twoballoons (Spatial Diagramming & Logic Studio).
You process diagram AST fragments written in LogiDSL and PhiloDSL.
When performing spatial generative fill, modify ONLY the targeted node IDs provided.
Preserve all unselected node layout coordinates, connection anchors, and structural boundaries.
Output clean, valid LogiDSL / PhiloDSL code without surrounding markdown backticks when streaming AST deltas.
"""

class SpatialFillRequest(BaseModel):
    target_ast: str
    prompt: str
    model: Optional[str] = "gemini-3.6-flash"
    selected_node_ids: Optional[list] = []

class DiagramRequest(BaseModel):
    prompt: str
    target_format: Optional[str] = "logidsl" # logidsl, mermaid, plantuml, d2
    model: Optional[str] = "gemini-3.6-pro"

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "sdk_available": ANTIGRAVITY_SDK_AVAILABLE,
        "engine": "google-antigravity-v1",
        "models": ["gemini-3.6-pro", "gemini-3.6-flash"]
    }

@app.post("/generate/spatial-fill")
async def spatial_generative_fill(req: SpatialFillRequest):
    async def event_generator() -> AsyncGenerator[str, None]:
        if ANTIGRAVITY_SDK_AVAILABLE:
            config = LocalAgentConfig(
                system_instructions=SYSTEM_INSTRUCTIONS,
                capabilities=CapabilitiesConfig(read_only=True)
            )
            async with Agent(config) as agent:
                full_prompt = (
                    f"TARGET AST FRAGMENT:\n{req.target_ast}\n\n"
                    f"SELECTED NODE IDS: {json.dumps(req.selected_node_ids)}\n\n"
                    f"USER INSTRUCTION:\n{req.prompt}"
                )
                response = await agent.chat(full_prompt, model=req.model)

                # 1. Stream reasoning/thinking deltas to UI
                if hasattr(response, "thoughts"):
                    async for thought in response.thoughts:
                        yield f"data: {json.dumps({'type': 'thought', 'content': thought})}\n\n"

                # 2. Stream generated AST code tokens
                async for token in response:
                    yield f"data: {json.dumps({'type': 'token', 'content': token})}\n\n"
        else:
            # Fallback streamer for local development testing
            yield f"data: {json.dumps({'type': 'thought', 'content': 'Analyzing spatial bounding box and targeted node IDs...'})}\n\n"
            await asyncio.sleep(0.2)
            yield f"data: {json.dumps({'type': 'thought', 'content': 'Synthesizing LogiDSL AST fragment rewrite...'})}\n\n"
            await asyncio.sleep(0.2)
            modified_ast = f"// Modified spatial fragment\n{req.target_ast}\n// Rewritten according to instruction: {req.prompt}"
            yield f"data: {json.dumps({'type': 'token', 'content': modified_ast})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@app.post("/generate/diagram")
async def generate_diagram(req: DiagramRequest):
    async def event_generator() -> AsyncGenerator[str, None]:
        if ANTIGRAVITY_SDK_AVAILABLE:
            config = LocalAgentConfig(system_instructions=SYSTEM_INSTRUCTIONS)
            async with Agent(config) as agent:
                prompt = f"Generate a complete {req.target_format} diagram specification for:\n{req.prompt}"
                response = await agent.chat(prompt, model=req.model)

                if hasattr(response, "thoughts"):
                    async for thought in response.thoughts:
                        yield f"data: {json.dumps({'type': 'thought', 'content': thought})}\n\n"

                async for token in response:
                    yield f"data: {json.dumps({'type': 'token', 'content': token})}\n\n"
        else:
            yield f"data: {json.dumps({'type': 'thought', 'content': 'Processing diagram generation request...'})}\n\n"
            await asyncio.sleep(0.2)
            yield f"data: {json.dumps({'type': 'token', 'content': f'// Generated {req.target_format} for: {req.prompt}'})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 50927))
    uvicorn.run(app, host="127.0.0.1", port=port)
