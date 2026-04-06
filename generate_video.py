import os
import sys
sys.path.insert(0, os.path.abspath(''))
from dotenv import load_dotenv
load_dotenv('/app/backend/.env')

from emergentintegrations.llm.openai.video_generation import OpenAIVideoGeneration

prompt = """A comedic short film scene in a modern apartment. A tired young French man in his 30s stands in front of an overflowing washing machine with piles of dirty laundry everywhere. He looks exhausted and desperate. Then he picks up his phone, his eyes light up with excitement as he discovers something amazing on the screen. He smiles widely, throws his hands up in relief, and walks away happily leaving the laundry behind. Bright, warm lighting. Realistic cinematic look. Vertical format for Instagram Reels."""

print("Generating video 1: POV Tu decouvres Kilolab...")
print("This may take 3-5 minutes...")

video_gen = OpenAIVideoGeneration(api_key=os.environ['EMERGENT_LLM_KEY'])
video_bytes = video_gen.text_to_video(
    prompt=prompt,
    model="sora-2",
    size="1280x720",
    duration=8,
    max_wait_time=600
)

if video_bytes:
    video_gen.save_video(video_bytes, '/app/video_kilolab_pov.mp4')
    print("Video saved to /app/video_kilolab_pov.mp4")
else:
    print("Video generation failed")
