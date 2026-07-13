import asyncio
from database import engine, AsyncSessionLocal
from models import Post

async def main():
    async with AsyncSessionLocal() as db:
        post = await db.get(Post, 1)
        if post:
            await db.delete(post)
            await db.commit()
            print("Deleted")
        else:
            print("Not found")

asyncio.run(main())
