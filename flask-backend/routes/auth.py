from flask import Blueprint, request, jsonify
from models.user import User
from db import db
from utils.auth import hash_password, verify_password, generate_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/users/register', methods=['POST'])
def register():
    """
    用户注册
    POST /api/users/register
    请求参数:
        {
            "username": "用户名",
            "password": "密码",
            "role": "用户角色(user/admin)",
            "supplier_id": 供应商ID(可选)
        }
    返回示例:
        {
            "id": 1,
            "username": "test",
            "role": "user",
            "supplier_id": null,
            "created_at": "2024-01-01 12:00:00"
        }
    """
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': '用户名和密码不能为空'}), 400
    
    if User.query.filter_by(username=username).first():
        return jsonify({'error': '用户名已存在'}), 400
    
    new_user = User(
        username=username,
        password=hash_password(password),
        role=data.get('role', 'user'),
        supplier_id=data.get('supplier_id')
    )
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify(new_user.to_dict()), 201

@auth_bp.route('/users/login', methods=['POST'])
def login():
    """
    用户登录
    POST /api/users/login
    请求参数:
        {
            "username": "用户名",
            "password": "密码"
        }
    返回示例:
        {
            "id": 1,
            "username": "test",
            "role": "user",
            "supplier_id": null,
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
    """
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()
    
    if not user or not verify_password(password, user.password):
        return jsonify({'error': '用户名或密码错误'}), 401
    
    token = generate_token(user.id, user.role)
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'role': user.role,
        'supplier_id': user.supplier_id,
        'access_token': token
    })
