
import requests
import json

BASE_URL = "http://localhost:8005/blogs"

def test_blog_crud():
    print("Testing Blog CRUD...")
    
    # 1. Create a blog
    blog_data = {
        "title": "Test Blog Title",
        "slug": "test-blog-title",
        "content": "This is a test blog content.",
        "excerpt": "This is a test blog excerpt.",
        "category": "Test",
        "author": "Test Author",
        "image_url": "https://example.com/image.jpg",
        "published": True
    }
    
    print(f"Creating blog: {blog_data['title']}")
    response = requests.post(BASE_URL + "/", json=blog_data)
    if response.status_code == 201:
        blog = response.json()
        blog_id = blog['id']
        print(f"Blog created successfully with ID: {blog_id}")
    elif response.status_code == 400 and "already exists" in response.text:
        print("Blog already exists, fetching it...")
        response = requests.get(BASE_URL + "/")
        blogs = response.json()
        blog = next((b for b in blogs if b['slug'] == blog_data['slug']), None)
        if blog:
            blog_id = blog['id']
            print(f"Found existing blog with ID: {blog_id}")
        else:
            print("Failed to find existing blog.")
            return
    else:
        print(f"Failed to create blog: {response.status_code} - {response.text}")
        return

    # 2. Get the blog by ID
    print(f"Fetching blog by ID: {blog_id}")
    response = requests.get(f"{BASE_URL}/{blog_id}")
    if response.status_code == 200:
        print(f"Blog fetched successfully: {response.json()['title']}")
    else:
        print(f"Failed to fetch blog by ID: {response.status_code}")

    # 3. Update the blog
    update_data = {
        "title": "Updated Test Blog Title",
        "slug": "test-blog-title", # Keep same slug
        "content": "This is updated test blog content.",
        "excerpt": "This is updated test blog excerpt.",
        "category": "Test",
        "author": "Test Author",
        "image_url": "https://example.com/image.jpg",
        "published": True
    }
    print(f"Updating blog ID {blog_id}")
    response = requests.put(f"{BASE_URL}/{blog_id}", json=update_data)
    if response.status_code == 200:
        print(f"Blog updated successfully: {response.json()['title']}")
    else:
        print(f"Failed to update blog: {response.status_code} - {response.text}")

    # 4. Delete the blog
    print(f"Deleting blog ID {blog_id}")
    response = requests.delete(f"{BASE_URL}/{blog_id}")
    if response.status_code == 204:
        print("Blog deleted successfully.")
    else:
        print(f"Failed to delete blog: {response.status_code}")

if __name__ == "__main__":
    test_blog_crud()
