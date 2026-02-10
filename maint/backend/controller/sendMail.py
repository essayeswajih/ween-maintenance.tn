import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

AdminEmail = os.getenv('SENDER_EMAIL')

BREVO_SMTP_LOGIN = "9f1d60001@smtp-brevo.com"  # 👈 REQUIRED

def send_email(to_email, subject, body):
    from_email = os.getenv("SENDER_EMAIL")
    smtp_pass = os.getenv("SENDER_PASSWORD")
    smtp_server = os.getenv("SENDER_SERVER")
    smtp_port = int(os.getenv("SENDER_PORT"))

    if not all([from_email, smtp_pass, smtp_server]):
        raise RuntimeError("Missing SMTP env variables")

    msg = MIMEMultipart()
    msg["From"] = from_email
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "html", "utf-8"))

    try:
        server = smtplib.SMTP(smtp_server, smtp_port, timeout=15)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(BREVO_SMTP_LOGIN, smtp_pass)  # ✅ FIX
        server.sendmail(from_email, to_email, msg.as_string())
        server.quit()
        print(f"✅ Email sent to {to_email}")
    except Exception as e:
        print(f"❌ Email sending failed: {e}")
        raise

