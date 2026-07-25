from flask import Blueprint, request, jsonify
from models.user import User
from db import db

users_bp = Blueprint('users', __name__)

@users_bp.route('/users', methods=['GET'])
def get_users():
    """
    获取用户列表
    GET /api/users
    """
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])

@users_bp.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    """
    获取单个用户
    GET /api/users/:id
    """
    user = User.query.get(id)
    if not user:
        return jsonify({'error': '用户不存在'}), 404
    return jsonify(user.to_dict())

@users_bp.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    """
    更新用户
    PUT /api/users/:id
    """
    user = User.query.get(id)
    if not user:
        return jsonify({'error': '用户不存在'}), 404
    data = request.get_json()
    for key, value in data.items():
        if key != 'password':
            setattr(user, key, value)
    db.session.commit()
    return jsonify(user.to_dict())

@users_bp.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    """
    删除用户
    DELETE /api/users/:id
    """
    user = User.query.get(id)
    if not user:
        return jsonify({'error': '用户不存在'}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': '用户删除成功'})
