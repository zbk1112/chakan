from db import db
from datetime import datetime

class TrainingRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    supplier_id = db.Column(db.Integer, nullable=False)
    project_id = db.Column(db.Integer, nullable=False)
    training_date = db.Column(db.DateTime, default=datetime.now)
    trainer = db.Column(db.String(50))
    completed = db.Column(db.Boolean, default=False)
    score = db.Column(db.Float)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    def to_dict(self):
        return {
            'id': self.id,
            'supplier_id': self.supplier_id,
            'project_id': self.project_id,
            'training_date': self.training_date.strftime('%Y-%m-%d %H:%M:%S'),
            'trainer': self.trainer,
            'completed': self.completed,
            'score': self.score,
            'notes': self.notes,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
