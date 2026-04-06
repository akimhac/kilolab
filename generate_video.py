import os
import sys
sys.path.insert(0, os.path.abspath(''))
from dotenv import load_dotenv
load_dotenv('/app/backend/.env')

from emergentintegrations.llm.openai.video_generation import OpenAIVideoGeneration

video_gen = OpenAIVideoGeneration(api_key=os.environ['EMERGENT_LLM_KEY'])

videos = [
    {
        "name": "script1_avengers_linge",
        "prompt": "A comedic cinematic scene in a modern apartment. A teenager in a red and blue spider-man-like hoodie is hanging upside down from the ceiling by a thread, casually scrolling on his phone and tapping to order something. Below him, the laundry room is total chaos: a washing machine is sparking and broken, clothes are scattered everywhere, a massive pile of dirty laundry towers in the corner. A muscular blonde man with a large hammer looks confused staring at a destroyed t-shirt. Another man in a suit holds a screwdriver looking helpless at the broken machine. The spider kid smiles, taps his phone 3 times, and sticks a post-it note on the laundry basket. Cinematic lighting, Marvel-inspired color grading, humorous tone. No text overlay. 1280x720."
    },
    {
        "name": "script2_goku_chichi",
        "prompt": "A comedic anime-inspired live action scene in a small Japanese-style house. A strong exhausted woman with black hair tied up stands in front of an enormous mountain of bright orange clothes and towels, looking completely overwhelmed and frustrated. Behind her, a muscular man with wild spiky black hair is casually making a huge sandwich in the kitchen, completely oblivious to the laundry disaster. A round pink chubby creature sits on the floor happily chewing on a sock. The woman looks at the camera with a desperate expression. Warm bright anime-inspired lighting, exaggerated expressions, comedic tone. No dialogue. Cinematic quality."
    },
    {
        "name": "script3_belgique_libre",
        "prompt": "A comedic scene inside a grand old European parliament hall. Politicians in suits are passionately arguing and shouting at each other across the chamber, papers flying everywhere. One representative in the middle is completely ignoring the debate, calmly eating french fries from a paper cone with mayonnaise. A ghostly translucent figure of an elegant man in a 1960s suit appears dramatically, gesturing wildly at everyone. Meanwhile, a young man with ginger hair and a blue sweater sits calmly in the corner, taps his phone 3 times with a satisfied smile, then walks out. Belgian flags everywhere. Absurdist humor, warm golden lighting, Wes Anderson-inspired symmetrical framing."
    },
    {
        "name": "script4_wazemmes_lille",
        "prompt": "A documentary-style handheld camera shot at a bustling outdoor French market on a Sunday morning. A young tired female medical student with glasses and a heavy backpack walks through the crowded market stalls, looking at her phone searching for something. She passes by colorful fruit stands, cheese vendors, and fabric merchants. She looks frustrated and exhausted. Then she stops, taps her phone a few times, and her face lights up with relief and a genuine smile. She puts her phone away and walks through the market freely, buying a crepe from a street vendor. Natural morning light, authentic market atmosphere, documentary realism, warm tones. Lille France vibes. No text."
    }
]

for i, v in enumerate(videos):
    print(f"\n{'='*60}")
    print(f"Generating video {i+1}/4: {v['name']}...")
    print(f"{'='*60}")
    try:
        video_bytes = video_gen.text_to_video(
            prompt=v['prompt'],
            model="sora-2",
            size="1280x720",
            duration=12,
            max_wait_time=600
        )
        if video_bytes:
            path = f"/app/public/{v['name']}.mp4"
            video_gen.save_video(video_bytes, path)
            print(f"SUCCESS: Video saved to {path}")
        else:
            print(f"FAIL: No video bytes returned for {v['name']}")
    except Exception as e:
        print(f"ERROR: {v['name']} - {e}")

print("\n\nDONE! All videos generated.")
