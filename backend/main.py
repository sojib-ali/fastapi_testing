from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

posts: list[dict] = [
    {
        "id": 1,
        "author": "Sojib",
        "title": "FastAPI is Awesome",
        "content": "This framework is really easy to use and super fast",
        "date_posted": "April 20, 2025"
    },

    {
        "id": 2,
        "author": "jane doe",
        "title": "Javascript sucks",
        "content": "Nothing to do",
        "date_posted": "April 21, 2025"
    }
]

# @app.get("/",  include_in_schema=False)
# @app.get("/posts", include_in_schema=False)


@app.get("/api/posts")
def get_posts():
    return posts


@app.get("/api/posts/{post_id}")
def get_posts(post_id: int):
    for post in posts:
        if post.get("id") == post_id:
            return post
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")