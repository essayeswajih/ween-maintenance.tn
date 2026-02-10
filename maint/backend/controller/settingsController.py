from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.settingsSchemas import SettingsResponse, SettingsUpdate
from crud.settingsCrud import get_settings, update_settings

router = APIRouter(
    tags=["settings"]
)
from utils.auth import admin_only

@router.get(("/"), response_model=SettingsResponse)
def read_settings(db: Session = Depends(get_db)):
    return get_settings(db)

@router.put(("/"), response_model=SettingsResponse, dependencies=[Depends(admin_only)])
def write_settings(settings_in: SettingsUpdate, db: Session = Depends(get_db)):
    return update_settings(db, settings_in)
