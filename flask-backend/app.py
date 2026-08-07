from flask import Flask, send_from_directory
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os
from config import Config
from db import db

def create_app():
    app = Flask(__name__, static_folder='../dist', static_url_path='')
    app.config.from_object(Config)
    
    db.init_app(app)
    JWTManager(app)
    CORS(app)
    
    with app.app_context():
        from routes.auth import auth_bp
        from routes.suppliers import suppliers_bp
        from routes.equipment import equipment_bp
        from routes.projects import projects_bp
        from routes.training import training_bp
        from routes.forms import forms_bp
        from routes.settlements import settlements_bp
        from routes.faults import faults_bp
        from routes.users import users_bp
        
        app.register_blueprint(auth_bp, url_prefix='/api')
        app.register_blueprint(suppliers_bp, url_prefix='/api')
        app.register_blueprint(equipment_bp, url_prefix='/api')
        app.register_blueprint(projects_bp, url_prefix='/api')
        app.register_blueprint(training_bp, url_prefix='/api')
        app.register_blueprint(forms_bp, url_prefix='/api')
        app.register_blueprint(settlements_bp, url_prefix='/api')
        app.register_blueprint(faults_bp, url_prefix='/api')
        app.register_blueprint(users_bp, url_prefix='/api')
        
        db.create_all()
        print('数据库表创建完成')
    
    @app.route('/api/health')
    def health():
        return {'status': 'ok', 'timestamp': os.popen('date /t').read().strip()}
    
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        if path and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=3000, debug=False)
