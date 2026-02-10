from sqlalchemy.orm import Session
from models.siteModels import Site
from schemas.site import SiteCreate, SiteUpdate

# -------------------------
# CREATE / INIT SITE PARAMETERS
# -------------------------
def create_site(db: Session, site_in: SiteCreate) -> Site:
    site = Site(**site_in.dict())
    db.add(site)
    db.commit()
    db.refresh(site)
    return site

# -------------------------
# GET SITE (single row, id=1)
# -------------------------
def get_site(db: Session, site_id: int = 1) -> Site:
    return db.query(Site).filter(Site.id == site_id).first()

# -------------------------
# UPDATE SITE
# -------------------------
def update_site(db: Session, site_id: int, site_in: SiteUpdate) -> Site:
    site = db.query(Site).filter(Site.id == site_id).first()
    if not site:
        return None
    for field, value in site_in.dict(exclude_unset=True).items():
        setattr(site, field, value)
    db.commit()
    db.refresh(site)
    return site
