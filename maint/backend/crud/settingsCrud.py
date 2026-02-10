from sqlalchemy.orm import Session
from models.settingsModels import Settings
from schemas.settingsSchemas import SettingsUpdate

def get_settings(db: Session):
    settings = db.query(Settings).first()
    if not settings:
        # Create default if none exists
        settings = Settings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

def update_settings(db: Session, settings_in: SettingsUpdate):
    settings = get_settings(db)
    update_data = settings_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(settings, field, value)
    db.commit()
    db.refresh(settings)
    return settings
