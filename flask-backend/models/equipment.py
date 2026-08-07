from db import db
from datetime import datetime

class Equipment(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50))
    serial_number = db.Column(db.String(50))
    status = db.Column(db.String(20), default='available')
    supplier_id = db.Column(db.Integer)
    assigned_at = db.Column(db.DateTime)
    returned_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    
    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'model': self.model,
            'serial_number': self.serial_number,
            'status': self.status,
            'supplier_id': self.supplier_id,
            'assigned_at': self.assigned_at.strftime('%Y-%m-%d %H:%M:%S') if self.assigned_at else None,
            'returned_at': self.returned_at.strftime('%Y-%m-%d %H:%M:%S') if self.returned_at else None,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S')
        }
