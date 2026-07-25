from flask import Blueprint, request, jsonify
from models.fault_record import FaultRecord
from db import db
from datetime import datetime

faults_bp = Blueprint('faults', __name__)

@faults_bp.route('/faults', methods=['GET'])
def get_fault_records():
    """
    获取故障记录列表
    GET /api/faults?equipment_id=1&supplier_id=1&status=reported
    """
    query = FaultRecord.query
    if 'equipment_id' in request.args:
        query = query.filter_by(equipment_id=int(request.args['equipment_id']))
    if 'supplier_id' in request.args:
        query = query.filter_by(supplier_id=int(request.args['supplier_id']))
    if 'status' in request.args:
        query = query.filter_by(status=request.args['status'])
    records = query.all()
    return jsonify([r.to_dict() for r in records])

@faults_bp.route('/faults/<int:id>', methods=['GET'])
def get_fault_record(id):
    """
    获取单个故障记录
    GET /api/faults/:id
    """
    record = FaultRecord.query.get(id)
    if not record:
        return jsonify({'error': '故障记录不存在'}), 404
    return jsonify(record.to_dict())

@faults_bp.route('/faults', methods=['POST'])
def create_fault_record():
    """
    创建故障记录
    POST /api/faults
    """
    data = request.get_json()
    new_record = FaultRecord(**data)
    db.session.add(new_record)
    db.session.commit()
    return jsonify(new_record.to_dict()), 201

@faults_bp.route('/faults/<int:id>', methods=['PUT'])
def update_fault_record(id):
    """
    更新故障记录
    PUT /api/faults/:id
    """
    record = FaultRecord.query.get(id)
    if not record:
        return jsonify({'error': '故障记录不存在'}), 404
    data = request.get_json()
    for key, value in data.items():
        setattr(record, key, value)
    db.session.commit()
    return jsonify(record.to_dict())

@faults_bp.route('/faults/<int:id>', methods=['DELETE'])
def delete_fault_record(id):
    """
    删除故障记录
    DELETE /api/faults/:id
    """
    record = FaultRecord.query.get(id)
    if not record:
        return jsonify({'error': '故障记录不存在'}), 404
    db.session.delete(record)
    db.session.commit()
    return jsonify({'message': '故障记录删除成功'})

@faults_bp.route('/faults/<int:id>/resolve', methods=['POST'])
def resolve_fault(id):
    """
    处理故障
    POST /api/faults/:id/resolve
    请求参数: {"resolution": "处理方案"}
    """
    record = FaultRecord.query.get(id)
    if not record:
        return jsonify({'error': '故障记录不存在'}), 404
    data = request.get_json()
    record.status = 'resolved'
    record.resolved_at = datetime.now()
    record.resolution = data.get('resolution')
    db.session.commit()
    return jsonify(record.to_dict())
