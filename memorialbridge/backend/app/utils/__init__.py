"""File upload utilities."""
import os
import aiofiles
from typing import Optional
from pathlib import Path
from PIL import Image
import io


UPLOAD_DIR = "uploads"
THUMBNAIL_SIZE = (300, 300)
MAX_IMAGE_SIZE = 2000
JPEG_QUALITY = 85


async def ensure_upload_directory():
    """Ensure upload directory exists."""
    Path(UPLOAD_DIR).mkdir(exist_ok=True)


async def save_uploaded_file(file_bytes: bytes, filename: str) -> str:
    """
    Save an uploaded file and return the path.
    
    Args:
        file_bytes: File content as bytes
        filename: Original filename
        
    Returns:
        Path to saved file
    """
    await ensure_upload_directory()
    
    # Generate unique filename
    timestamp = __import__('time').time()
    unique_filename = f"{timestamp}_{filename}"
    filepath = os.path.join(UPLOAD_DIR, unique_filename)
    
    async with aiofiles.open(filepath, 'wb') as f:
        await f.write(file_bytes)
    
    return filepath


async def process_image(file_bytes: bytes, filename: str) -> tuple[str, str]:
    """
    Process and save image with thumbnail.
    
    Args:
        file_bytes: Image file content
        filename: Original filename
        
    Returns:
        Tuple of (original_path, thumbnail_path)
    """
    # Open image
    img = Image.open(io.BytesIO(file_bytes))
    
    # Convert RGBA to RGB if needed
    if img.mode in ('RGBA', 'LA', 'P'):
        img = img.convert('RGB')
    
    # Resize if too large
    if max(img.size) > MAX_IMAGE_SIZE:
        img.thumbnail((MAX_IMAGE_SIZE, MAX_IMAGE_SIZE), Image.Resampling.LANCZOS)
    
    # Save original
    original_path = await save_uploaded_file(
        _image_to_bytes(img),
        filename
    )
    
    # Create and save thumbnail
    img.thumbnail(THUMBNAIL_SIZE, Image.Resampling.LANCZOS)
    thumbnail_filename = f"thumb_{filename}"
    thumbnail_path = await save_uploaded_file(
        _image_to_bytes(img),
        thumbnail_filename
    )
    
    return original_path, thumbnail_path


def _image_to_bytes(img: Image.Image) -> bytes:
    """Convert PIL Image to bytes."""
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG', quality=JPEG_QUALITY, optimize=True)
    return img_bytes.getvalue()


def is_valid_image_mime_type(mime_type: str) -> bool:
    """Check if mime type is allowed."""
    allowed_types = ['image/jpeg', 'image/png', 'image/webp']
    return mime_type in allowed_types


def is_valid_image_size(size_bytes: int, max_bytes: int = 5 * 1024 * 1024) -> bool:
    """Check if image size is within limit."""
    return size_bytes <= max_bytes
