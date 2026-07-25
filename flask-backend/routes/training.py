from flask import Blueprint, request, jsonify
from models.training_record import TrainingRecord
from db import db

training_bp = Blueprint('training', __name__)

@training_bp.route('/training', methods=['GET'])
def get_training_records():
    """
    获取培训记录列表
    GET /api/training?supplier_id=1&project_id=1&completed=true
    """
    query = TrainingRecord.query
    if 'supplier_id' in request.args:
        query = query.filter_by(supplier_id=int(request.args['supplier_id']))
    if 'project_id' in request.args:
        query = query.filter_by(project_id=int(request.args['project_id']))
    if 'completed' in request.args:
        query = query.filter_by(completed=request.args['completed'] == 'true')
    records = query.all()
    return jsonify([r.to_dict() for r in records])

@training_bp.route('/training/<int:id>', methods=['GET'])
def get_training_record(id):
    """
    获取单个培训记录
    GET /api/training/:id
    """
    record = TrainingRecord.query.get(id)
    if not record:
        return jsonify({'error': '培训记录不存在'}), 404
    return jsonify(record.to_dict())

@training_bp.route('/training', methods=['POST'])
def create_training_record():
    """
    创建培训记录
    POST /api/training
    """
    data = request.get_json()
    new_record = TrainingRecord(**data)
    db.session.add(new_record)
    db.session.commit()
    return jsonify(new_record.to_dict()), 201

@training_bp.route('/training/<int:id>', methods=['PUT'])
def update_training_record(id):
    """
    更新培训记录
    PUT /api/training/:id
    """
    record = TrainingRecord.query.get(id)
    if not record:
        return jsonify({'error': '培训记录不存在'}), 404
    data = request.get_json()
    for key, value in data.items():
        setattr(record, key, value)
    db.session.commit()
    return jsonify(record.to_dict())

@training_bp.route('/training/<int:id>', methods=['DELETE'])
def delete_training_record(id):
    """
    删除培训记录
    DELETE /api/training/:id
    """
    record = TrainingRecord.query.get(id)
    if not record:
        return jsonify({'error': '培训记录不存在'}), 404
    db.session.delete(record)
    db.session.commit()
    return jsonify({'message': '培训记录删除成功'})
