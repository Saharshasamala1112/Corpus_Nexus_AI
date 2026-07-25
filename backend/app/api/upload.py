from fastapi import APIRouter, File, UploadFile
from fastapi.responses import StreamingResponse

from app.schemas.upload import UploadResponse
from app.services.upload_service import UploadService


router = APIRouter(
    prefix="/upload",
    tags=["Upload"],
)


upload_service = UploadService()


@router.post(
    "/image",
    response_model=UploadResponse,
)
async def upload_image(
    file: UploadFile = File(...),
):
    return await upload_service.upload_image(file)


@router.get("/image/{object_name}")
async def get_image(object_name: str):

    image = upload_service.get_image(object_name)

    return StreamingResponse(
        image,
        media_type="image/png",
    )