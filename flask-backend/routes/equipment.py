from flask import Blueprint, request, jsonify
from models.equipment import Equipment
from db import db
from datetime import datetime

equipment_bp = Blueprint('equipment', __name__)

@equipment_bp.route('/equipment', methods=['GET'])
def get_equipment():
    """
    获取设备列表
    GET /api/equipment
    请求参数: ?status=available&type=iPhone
    """
    query = Equipment.query
    if 'status' in request.args:
        query = query.filter_by(status=request.args['status'])
    if 'type' in request.args:
        query = query.filter_by(type=request.args['type'])
    equipment = query.all()
    return jsonify([e.to_dict() for e in equipment])

@equipment_bp.route('/equipment/<int:id>', methods=['GET'])
def get_equipment_item(id):
    """
    获取单个设备
    GET /api/equipment/:id
    """
    equipment = Equipment.query.get(id)
    if not equipment:
        return jsonify({'error': '设备不存在'}), 404
    return jsonify(equipment.to_dict())

@equipment_bp.route('/equipment', methods=['POST'])
def create_equipment():
    """
    创建设备
    POST /api/equipment
    """
    data = request.get_json()
    new_equipment = Equipment(**data)
    db.session.add(new_equipment)
    db.session.commit()
    return jsonify(new_equipment.to_dict()), 201

@equipment_bp.route('/equipment/<int:id>', methods=['PUT'])
def update_equipment(id):
    """
    更新设备
    PUT /api/equipment/:id
    """
    equipment = Equipment.query.get(id)
    if not equipment:
        return jsonify({'error': '设备不存在'}), 404
    data = request.get_json()
    for key, value in data.items():
        setattr(equipment, key, value)
    db.session.commit()
    return jsonify(equipment.to_dict())

@equipment_bp.route('/equipment/<int:id>', methods=['DELETE'])
def delete_equipment(id):
    """
    删除设备
    DELETE /api/equipment/:id
    """
    equipment = Equipment.query.get(id)
    if not equipment:
        return jsonify({'error': '设备不存在'}), 404
    db.session.delete(equipment)
    db.session.commit()
    return jsonify({'message': '设备删除成功'})

@equipment_bp.route('/equipment/<int:id>/assign', methods=['POST'])
def assign_equipment(id):
    """
    分配设备
    POST /api/equipment/:id/assign
    请求参数: {"supplier_id": 1}
    """
    equipment = Equipment.query.get(id)
    if not equipment:
        return jsonify({'error': '设备不存在'}), 404
    data = request.get_json()
    equipment.status = 'assigned'
    equipment.supplier_id = data.get('supplier_id')
    equipment.assigned_at = datetime.now()
    db.session.commit()
    return jsonify(equipment.to_dict())

@equipment_bp.route('/equipment/<int:id>/return', methods=['POST'])
def return_equipment(id):
    """
    归还设备
    POST /api/equipment/:id/return
    """
    equipment = Equipment.query.get(id)
    if not equipment:
        return jsonify({'error': '设备不存在'}), 404
    equipment.status = 'available'
    equipment.supplier_id = None
    equipment.returned_at = datetime.now()
    db.session.commit()
    return jsonify(equipment.to_dict())
