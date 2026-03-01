from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Union
import os
import httpx
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Email configuration
RESEND_API_KEY = os.environ.get("VITE_RESEND_API_KEY", "")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "akim.hachili@gmail.com")

class EmailRequest(BaseModel):
    to: Optional[Union[str, List[str]]] = None
    subject: Optional[str] = None
    html: Optional[str] = None
    type: Optional[str] = None
    data: Optional[dict] = None

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.post("/api/send-email")
async def send_email(request: EmailRequest):
    """Send email via Resend API - supports admin alerts and direct emails"""
    
    if not RESEND_API_KEY or RESEND_API_KEY == "re_votre_key_ici":
        raise HTTPException(status_code=500, detail="Email service not configured")
    
    # Handle admin alert types
    if request.type in ["admin_new_order", "admin_new_user"]:
        return await handle_admin_alert(request.type, request.data or {})
    
    # Standard email sending
    if not request.to or not request.subject:
        raise HTTPException(status_code=400, detail="Missing required fields: to, subject")
    
    to_list = [request.to] if isinstance(request.to, str) else request.to
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {RESEND_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "from": "Kilolab <noreply@kilolab.fr>",
                    "to": to_list,
                    "subject": request.subject,
                    "html": request.html or f"<p>{request.subject}</p>"
                }
            )
            
            if response.status_code != 200:
                data = response.json()
                raise HTTPException(status_code=response.status_code, detail=data.get("message", "Email send failed"))
            
            data = response.json()
            return {"success": True, "id": data.get("id"), "type": request.type or "general"}
            
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=str(e))

async def handle_admin_alert(alert_type: str, data: dict):
    """Handle admin alerts for new orders and new users"""
    
    if alert_type == "admin_new_order":
        order_id = (data.get("id") or "")[:8].upper()
        subject = f"🛒 Nouvelle commande #{order_id}"
        html = f"""
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%); padding: 25px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">🛒 Nouvelle Commande !</h1>
          </div>
          <div style="background: white; padding: 25px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="background: #f0fdfa; border-left: 4px solid #14b8a6; padding: 15px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
              <p style="margin: 0; color: #0f766e;"><strong>ID Commande:</strong> #{order_id}</p>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Client:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-weight: bold;">{data.get('client_email') or data.get('pickup_address') or 'Non spécifié'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Adresse:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">{data.get('pickup_address') or 'Non spécifiée'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Ville:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">{data.get('pickup_city') or 'Non spécifiée'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Poids estimé:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">{data.get('weight') or '?'} kg</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b;">Montant:</td>
                <td style="padding: 10px 0; color: #10b981; font-weight: bold; font-size: 18px;">{data.get('total_price') or '?'} €</td>
              </tr>
            </table>
            <a href="https://kilolab.fr/admin" style="display: block; background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%); color: white; text-align: center; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 25px;">
              Voir dans le Dashboard
            </a>
          </div>
        </body>
        </html>
        """
    elif alert_type == "admin_new_user":
        subject = f"👤 Nouvelle inscription: {data.get('email') or 'Utilisateur'}"
        html = f"""
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); padding: 25px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">👤 Nouvelle Inscription !</h1>
          </div>
          <div style="background: white; padding: 25px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="background: #f5f3ff; border-left: 4px solid #8b5cf6; padding: 15px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
              <p style="margin: 0; color: #6d28d9;"><strong>Un nouvel utilisateur vient de s'inscrire sur Kilolab</strong></p>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-weight: bold;">{data.get('email') or 'Non spécifié'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Nom:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">{data.get('full_name') or 'Non spécifié'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #64748b;">Rôle:</td>
                <td style="padding: 10px 0; color: #1e293b;">{data.get('role') or 'client'}</td>
              </tr>
            </table>
            <a href="https://kilolab.fr/admin" style="display: block; background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); color: white; text-align: center; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 25px;">
              Voir dans le Dashboard
            </a>
          </div>
        </body>
        </html>
        """
    else:
        raise HTTPException(status_code=400, detail="Unknown admin alert type")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {RESEND_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "from": "Kilolab Alertes <noreply@kilolab.fr>",
                    "to": [ADMIN_EMAIL],
                    "subject": subject,
                    "html": html
                }
            )
            
            if response.status_code != 200:
                data = response.json()
                raise HTTPException(status_code=response.status_code, detail=data.get("message", "Email send failed"))
            
            result = response.json()
            return {"success": True, "id": result.get("id"), "type": alert_type}
            
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=str(e))
