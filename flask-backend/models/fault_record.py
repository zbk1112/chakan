from db import db
from datetime import datetime

class FaultRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    equipment_id = db.Column(db.Integer, nullable=False)
    supplier_id = db.Column(db.Integer)
    fault_type = db.Column(db.String(50))
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='reported')
    resolved_at = db.Column(db.DateTime)
    resolution = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    def to_dict(self):
        return {
            'id': self.id,
            'equipment_id': self.equipment_id,
            'supplier_id': self.supplier_id,
            'fault_type': self.fault_type,
            'description': self.description,
            'status': self.status,
            'resolved_at': self.resolved_at.strftime('%Y-%m-%d %H:%M:%S') if self.resolved_at else None,
            'resolution': self.resolution,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
