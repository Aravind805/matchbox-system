from firebase_admin import messaging
from backend.services.firebase import firebase_admin


def send_notification(token, title, body, data=None):
    """
    Send push notification to a single device
    """
    message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=body,
        ),
        data=data or {},
        token=token,
    )

    response = messaging.send(message)
    return response
