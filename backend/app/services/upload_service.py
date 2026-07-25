from io import BytesIO
from uuid import uuid4

from fastapi import HTTPException, UploadFile
from minio.error import S3Error

from app.core.config import settings
from app.core.minio import get_minio_client


class UploadService:
    def __init__(self):
        self.client = get_minio_client()
        self.bucket_name = settings.MINIO_BUCKET_NAME

        if not self.client.bucket_exists(self.bucket_name):
            self.client.make_bucket(self.bucket_name)

    async def upload_image(self, file: UploadFile):
        try:
            extension = file.filename.split(".")[-1]
            object_name = f"{uuid4()}.{extension}"

            file_content = await file.read()
            file_size = len(file_content)

            self.client.put_object(
                bucket_name=self.bucket_name,
                object_name=object_name,
                data=BytesIO(file_content),
                length=file_size,
                content_type=file.content_type,
            )

            image_url = (
                f"http://127.0.0.1:8000/upload/image/{object_name}"
            )

            return {
                "filename": file.filename,
                "object_name": object_name,
                "image_url": image_url,
                "content_type": file.content_type,
                "message": "Image uploaded successfully",
            }

        except S3Error as exc:
            raise HTTPException(
                status_code=500,
                detail=f"MinIO Error: {exc}",
            )

    def get_image(self, object_name: str):
        try:
            response = self.client.get_object(
                self.bucket_name,
                object_name,
            )

            return response

        except S3Error as exc:
            raise HTTPException(
                status_code=404,
                detail=f"Image not found: {exc}",
            )