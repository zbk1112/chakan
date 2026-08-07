from flask import Blueprint, request, jsonify
from models.settlement_record import SettlementRecord
from db import db

settlements_bp = Blueprint('settlements', __name__)

@settlements_bp.route('/settlements', methods=['GET'])
def get_settlement_records():
    """
    获取结算记录列表
    GET /api/settlements?supplier_id=1&project_id=1&status=pending&period=2024-01
    """
    query = SettlementRecord.query
    if 'supplier_id' in request.args:
        query = query.filter_by(supplier_id=int(request.args['supplier_id']))
    if 'project_id' in request.args:
        query = query.filter_by(project_id=int(request.args['project_id']))
    if 'status' in request.args:
        query = query.filter_by(status=request.args['status'])
    if 'period' in request.args:
        query = query.filter_by(period=request.args['period'])
    records = query.all()
    return jsonify([r.to_dict() for r in records])

@settlements_bp.route('/settlements/<int:id>', methods=['GET'])
def get_settlement_record(id):
    """
    获取单个结算记录
    GET /api/settlements/:id
    """
    record = SettlementRecord.query.get(id)
    if not record:
        return jsonify({'error': '结算记录不存在'}), 404
    return jsonify(record.to_dict())

@settlements_bp.route('/settlements', methods=['POST'])
def create_settlement_record():
    """
    创建结算记录
    POST /api/settlements
    """
    data = request.get_json()
    new_record = SettlementRecord(**data)
    db.session.add(new_record)
    db.session.commit()
    return jsonify(new_record.to_dict()), 201

@settlements_bp.route('/settlements/<int:id>', methods=['PUT'])
def update_settlement_record(id):
    """
    更新结算记录
    PUT /api/settlements/:id
    """
    record = SettlementRecord.query.get(id)
    if not record:
        return jsonify({'error': '结算记录不存在'}), 404
    data = request.get_json()
    for key, value in data.items():
        setattr(record, key, value)
    db.session.commit()
    return jsonify(record.to_dict())

@settlements_bp.route('/settlements/<int:id>', methods=['DELETE'])
def delete_settlement_record(id):
    """
    删除结算记录
    DELETE /api/settlements/:id
    """
    record = SettlementRecord.query.get(id)
    if not record:
        return jsonify({'error': '结算记录不存在'}), 404
    db.session.delete(record)
    db.session.commit()
    return jsonify({'message': '结算记录删除成功'})
