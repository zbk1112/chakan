from flask import Blueprint, request, jsonify
from models.form import Form
from db import db

forms_bp = Blueprint('forms', __name__)

@forms_bp.route('/forms', methods=['GET'])
def get_forms():
    """
    获取表单列表
    GET /api/forms?type=application&supplier_id=1&status=draft
    """
    query = Form.query
    if 'type' in request.args:
        query = query.filter_by(type=request.args['type'])
    if 'supplier_id' in request.args:
        query = query.filter_by(supplier_id=int(request.args['supplier_id']))
    if 'status' in request.args:
        query = query.filter_by(status=request.args['status'])
    forms = query.all()
    return jsonify([f.to_dict() for f in forms])

@forms_bp.route('/forms/<int:id>', methods=['GET'])
def get_form(id):
    """
    获取单个表单
    GET /api/forms/:id
    """
    form = Form.query.get(id)
    if not form:
        return jsonify({'error': '表单不存在'}), 404
    return jsonify(form.to_dict())

@forms_bp.route('/forms', methods=['POST'])
def create_form():
    """
    创建表单
    POST /api/forms
    """
    data = request.get_json()
    new_form = Form(**data)
    db.session.add(new_form)
    db.session.commit()
    return jsonify(new_form.to_dict()), 201

@forms_bp.route('/forms/<int:id>', methods=['PUT'])
def update_form(id):
    """
    更新表单
    PUT /api/forms/:id
    """
    form = Form.query.get(id)
    if not form:
        return jsonify({'error': '表单不存在'}), 404
    data = request.get_json()
    for key, value in data.items():
        setattr(form, key, value)
    db.session.commit()
    return jsonify(form.to_dict())

@forms_bp.route('/forms/<int:id>', methods=['DELETE'])
def delete_form(id):
    """
    删除表单
    DELETE /api/forms/:id
    """
    form = Form.query.get(id)
    if not form:
        return jsonify({'error': '表单不存在'}), 404
    db.session.delete(form)
    db.session.commit()
    return jsonify({'message': '表单删除成功'})
