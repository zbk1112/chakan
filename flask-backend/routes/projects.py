from flask import Blueprint, request, jsonify
from models.project import Project
from db import db

projects_bp = Blueprint('projects', __name__)

@projects_bp.route('/projects', methods=['GET'])
def get_projects():
    """
    获取项目列表
    GET /api/projects
    """
    projects = Project.query.all()
    return jsonify([p.to_dict() for p in projects])

@projects_bp.route('/projects/<int:id>', methods=['GET'])
def get_project(id):
    """
    获取单个项目
    GET /api/projects/:id
    """
    project = Project.query.get(id)
    if not project:
        return jsonify({'error': '项目不存在'}), 404
    return jsonify(project.to_dict())

@projects_bp.route('/projects', methods=['POST'])
def create_project():
    """
    创建项目
    POST /api/projects
    """
    data = request.get_json()
    new_project = Project(**data)
    db.session.add(new_project)
    db.session.commit()
    return jsonify(new_project.to_dict()), 201

@projects_bp.route('/projects/<int:id>', methods=['PUT'])
def update_project(id):
    """
    更新项目
    PUT /api/projects/:id
    """
    project = Project.query.get(id)
    if not project:
        return jsonify({'error': '项目不存在'}), 404
    data = request.get_json()
    for key, value in data.items():
        setattr(project, key, value)
    db.session.commit()
    return jsonify(project.to_dict())

@projects_bp.route('/projects/<int:id>', methods=['DELETE'])
def delete_project(id):
    """
    删除项目
    DELETE /api/projects/:id
    """
    project = Project.query.get(id)
    if not project:
        return jsonify({'error': '项目不存在'}), 404
    db.session.delete(project)
    db.session.commit()
    return jsonify({'message': '项目删除成功'})
