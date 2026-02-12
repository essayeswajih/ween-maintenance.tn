from fastapi import HTTPException, Depends, status
from controller.Oauth2C import get_current_user
from models.Oauth2Models import User

class RoleChecker:
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: User = Depends(get_current_user)):
        if user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have enough permissions to perform this action"
            )
        return user

# Helper instances
admin_only = RoleChecker(["admin"])
fournisseur_only = RoleChecker(["fournisseur"])
admin_or_fournisseur = RoleChecker(["admin", "fournisseur"])
any_authenticated = RoleChecker(["admin", "fournisseur", "client"])

import re
import unicodedata

def getSlug(text: str) -> str:
    if not text:
        return ""
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
    text = re.sub(r'[^\w\s-]', '', text).strip().lower()
    return re.sub(r'[-\s]+', '-', text)
