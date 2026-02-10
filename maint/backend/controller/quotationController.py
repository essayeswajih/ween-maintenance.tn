from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import datetime

from db.database import get_db
from models.servicesModels import Quotation, QuotationProposal, Service
from models.Oauth2Models import User
from models.freelancer import Freelancer
from controller.Oauth2C import get_current_user
from pydantic import BaseModel

router = APIRouter()

# --- Pydantic Schemas for Request Body ---

class QuotationCreate(BaseModel):
    service_id: int
    first_name: str
    last_name: str
    email: str
    phone: str
    address: str
    city: str
    postal_code: Optional[str] = None
    description: str
    preferred_timeline: Optional[str] = None

class ProposalCreate(BaseModel):
    price: float
    message: Optional[str] = None

class InviteFreelancer(BaseModel):
    freelancer_id: int

# --- Endpoints ---

@router.post("", status_code=status.HTTP_201_CREATED)
def create_quotation_request(
    quote_in: QuotationCreate, 
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user) # Made user optional for guest quotes
):
    # Verify service exists
    service = db.query(Service).filter(Service.id == quote_in.service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    new_quote = Quotation(
        service_id=quote_in.service_id,
        user_id=current_user.id if current_user else None,
        first_name=quote_in.first_name,
        last_name=quote_in.last_name,
        email=quote_in.email,
        phone=quote_in.phone,
        address=quote_in.address,
        city=quote_in.city,
        postal_code=quote_in.postal_code,
        description=quote_in.description,
        preferred_timeline=quote_in.preferred_timeline,
        status="PENDING"
    )
    db.add(new_quote)
    db.commit()
    db.refresh(new_quote)
    return new_quote


@router.get("")
def get_quotations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Role-based access
    query = db.query(Quotation).options(joinedload(Quotation.service))
    
    if current_user.role == "admin":
        return query.all()
    elif current_user.role == "freelancer":
        if not current_user.freelancer:
             raise HTTPException(status_code=403, detail="User is not a linked freelancer profile")
        
        freelancer_id = current_user.freelancer.id
        return (
            query
            .join(QuotationProposal)
            .filter(QuotationProposal.freelancer_id == freelancer_id)
            .all()
        )
    else:
        # Client sees their own quotes by user_id or email
        return (
            query
            .filter(
                (Quotation.user_id == current_user.id) | 
                (Quotation.email == current_user.email)
            )
            .all()
        )

@router.post("/{quotation_id}/invite")
def invite_freelancer_to_quote(
    quotation_id: int, 
    invite: InviteFreelancer,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can invite freelancers")
    
    quotation = db.query(Quotation).filter(Quotation.id == quotation_id).first()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
        
    freelancer = db.query(Freelancer).filter(Freelancer.id == invite.freelancer_id).first()
    if not freelancer:
        raise HTTPException(status_code=404, detail="Freelancer not found")
        
    # Check if already invited
    existing = db.query(QuotationProposal).filter(
        QuotationProposal.quotation_id == quotation_id,
        QuotationProposal.freelancer_id == invite.freelancer_id
    ).first()
    
    if existing:
        return {"message": "Freelancer already invited"}
        
    # Create empty proposal (Invitation)
    new_proposal = QuotationProposal(
        quotation_id=quotation_id,
        freelancer_id=invite.freelancer_id,
        price=0, # Placeholder
        status="PENDING",
        message="Invited by Admin"
    )
    
    quotation.status = "OPEN" # Update status
    db.add(new_proposal)
    db.commit()
    return {"message": "Freelancer invited successfully"}

@router.post("/{quotation_id}/bid")
def submit_bid(
    quotation_id: int,
    bid: ProposalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "freelancer" or not current_user.freelancer:
        raise HTTPException(status_code=403, detail="Only freelancers can bid")
        
    freelancer_id = current_user.freelancer.id
    
    # Find the proposal (invitation) or create new if open market
    proposal = db.query(QuotationProposal).filter(
        QuotationProposal.quotation_id == quotation_id,
        QuotationProposal.freelancer_id == freelancer_id
    ).first()
    
    if not proposal:
        raise HTTPException(status_code=404, detail="You were not invited to this quotation")
        
    # Update proposal
    proposal.price = bid.price
    proposal.message = bid.message
    proposal.status = "SUBMITTED"
    
    db.commit()
    return {"message": "Bid submitted successfully"}

@router.post("/{quotation_id}/accept/{proposal_id}")
def accept_bid(
    quotation_id: int,
    proposal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can accept bids")
        
    quotation = db.query(Quotation).filter(Quotation.id == quotation_id).first()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
        
    proposal = db.query(QuotationProposal).filter(
        QuotationProposal.id == proposal_id, 
        QuotationProposal.quotation_id == quotation_id
    ).first()
    
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found for this quotation")
        
    # Accept logic
    proposal.status = "ACCEPTED"
    quotation.selected_proposal_id = proposal.id
    quotation.status = "ASSIGNED"
    
    # Send notification logic here (email to User with Freelancer info)
    
    db.commit()
    return {"message": "Bid accepted and Freelancer assigned"}

# Additional CRUD endpoints for admin management

@router.get("/{quotation_id}")
def get_quotation_by_id(
    quotation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a single quotation by ID with service and proposal details"""
    quotation = (
        db.query(Quotation)
        .options(
            joinedload(Quotation.service),
            joinedload(Quotation.proposals).joinedload(QuotationProposal.freelancer)
        )
        .filter(Quotation.id == quotation_id)
        .first()
    )
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    
    # Check permissions
    if current_user.role == "admin":
        return quotation
    elif current_user.role == "freelancer" and current_user.freelancer:
        # Freelancer can only see if they have a proposal
        proposal = db.query(QuotationProposal).filter(
            QuotationProposal.quotation_id == quotation_id,
            QuotationProposal.freelancer_id == current_user.freelancer.id
        ).first()
        if proposal:
            return quotation
    
    # Client can see their own
    if quotation.user_id == current_user.id or quotation.email == current_user.email:
        return quotation
    
    raise HTTPException(status_code=403, detail="Access denied")

class QuotationStatusUpdate(BaseModel):
    status: Optional[str] = None
    selected_proposal_id: Optional[int] = None

@router.put("/{quotation_id}")
def update_quotation(
    quotation_id: int,
    update_data: QuotationStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update quotation status and/or selected proposal (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update quotations")
    
    quotation = db.query(Quotation).filter(Quotation.id == quotation_id).first()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    
    # Update status if provided
    if update_data.status is not None:
        quotation.status = update_data.status
    
    # Update selected proposal if provided
    if update_data.selected_proposal_id is not None:
        # Verify the proposal exists and belongs to this quotation
        if update_data.selected_proposal_id and update_data.selected_proposal_id > 0:
            proposal = db.query(QuotationProposal).filter(
                QuotationProposal.id == update_data.selected_proposal_id,
                QuotationProposal.quotation_id == quotation_id
            ).first()
            if not proposal:
                raise HTTPException(status_code=404, detail="Proposal not found for this quotation")
            quotation.selected_proposal_id = update_data.selected_proposal_id
            # Auto-update status to ASSIGNED if a proposal is selected
            if quotation.status == "PENDING" or quotation.status == "OPEN":
                quotation.status = "ASSIGNED"
        else:
            # Clear the selection
            quotation.selected_proposal_id = None
    
    db.commit()
    db.refresh(quotation)
    return quotation

@router.delete("/{quotation_id}")
def delete_quotation(
    quotation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a quotation (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete quotations")
    
    quotation = db.query(Quotation).filter(Quotation.id == quotation_id).first()
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    
    db.delete(quotation)
    db.commit()
    return {"message": "Quotation deleted successfully"}
