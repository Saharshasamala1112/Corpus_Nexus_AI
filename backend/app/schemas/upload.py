from pydantic import BaseModel


class UploadResponse(BaseModel):
    filename: str
    object_name: str
    image_url: str
    content_type: str
    message: str