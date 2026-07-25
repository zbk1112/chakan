from flask import Blueprint, request, jsonify
from models.supplier import Supplier
from db import db

suppliers_bp = Blueprint('suppliers', __name__)

@suppliers_bp.route('/suppliers', methods=['GET'])
def get_suppliers():
    """
    获取供应商列表
    GET /api/suppliers
    请求参数: 无
    返回示例:
        [
            {
                "id": 1,
                "name": "供应商名称",
                "contact_person": "联系人",
                "phone": "电话",
                "email": "邮箱",
                "address": "地址",
                "status": "active",
                "created_at": "2024-01-01 12:00:00",
                "updated_at": "2024-01-01 12:00:00"
            }
        ]
    """
    suppliers = Supplier.query.all()
    return jsonify([s.to_dict() for s in suppliers])

@suppliers_bp.route('/suppliers/<int:id>', methods=['GET'])
def get_supplier(id):
    """
    获取单个供应商
    GET /api/suppliers/:id
    返回示例: 单个供应商对象
    """
    supplier = Supplier.query.get(id)
    if not supplier:
        return jsonify({'error': '供应商不存在'}), 404
    return jsonify(supplier.to_dict())

@suppliers_bp.route('/suppliers', methods=['POST'])
def create_supplier():
    """
    创建供应商
    POST /api/suppliers
    请求参数:
        {
            "name": "供应商名称",
            "contact_person": "联系人",
            "phone": "电话",
            "email": "邮箱",
            "address": "地址",
            "status": "active"
        }
    """
    data = request.get_json()
    new_supplier = Supplier(**data)
    db.session.add(new_supplier)
    db.session.commit()
    return jsonify(new_supplier.to_dict()), 201

@suppliers_bp.route('/suppliers/<int:id>', methods=['PUT'])
def update_supplier(id):
    """
    更新供应商
    PUT /api/suppliers/:id
    """
    supplier = Supplier.query.get(id)
    if not supplier:
        return jsonify({'error': '供应商不存在'}), 404
    data = request.get_json()
    for key, value in data.items():
        setattr(supplier, key, value)
    db.session.commit()
    return jsonify(supplier.to_dict())

@suppliers_bp.route('/suppliers/<int:id>', methods=['DELETE'])
def delete_supplier(id):
    """
    删除供应商
    DELETE /api/suppliers/:id
    """
    supplier = Supplier.query.get(id)
    if not supplier:
        return jsonify({'error': '供应商不存在'}), 404
    db.session.delete(supplier)
    db.session.commit()
    return jsonify({'message': '供应商删除成功'})
