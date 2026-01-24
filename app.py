from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from extensions import db
from routes.auth_routes import auth_bp
from routes. user_routes import user_bp
from routes.api_routes import api_bp
from routes.admin_routes import admin_bp
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging. DEBUG)
logger = logging.getLogger(__name__)
logging.getLogger('flask_cors').level = logging.DEBUG

def create_app():
    app = Flask(__name__)
    
    # Load config
    app.config.from_object(Config)
    
    # Configure CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000", "http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "User-Id"],
            "supports_credentials": True
        },
        r"/auth/*": {
            "origins": ["http://localhost:3000", "http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "User-Id"],
            "supports_credentials": True
        },
        r"/users/*": {
            "origins": ["http://localhost:3000", "http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "User-Id"],
            "supports_credentials": True
        },
        r"/admin/*": {
            "origins": ["http://localhost:3000", "http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "User-Id"],
            "supports_credentials": True
        }
    })

    # Initialize extensions
    db.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    # Health check endpoint
    @app.route('/')
    def health_check():
        return jsonify({
            "status": "healthy",
            "timestamp": datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'),
            "version": "1. 0.0"
        })

    # Error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        logger.error(f"404 error: {error}")
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"500 error: {error}")
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500

    @app.errorhandler(403)
    def forbidden_error(error):
        logger.error(f"403 error: {error}")
        return jsonify({"error": "Forbidden - Admin access required"}), 403

    # Log all requests in debug mode
    if app.debug:
        @app.before_request
        def log_request_info():
            from flask import request
            logger.debug('Headers: %s', request.headers)
            logger.debug('Body: %s', request.get_data())

        @app.after_request
        def log_response_info(response):
            logger.debug('Response: %s', response.get_data())
            return response

    return app

def init_database(app):
    """Initialize database tables"""
    with app.app_context():
        try:
            logger.info("Creating database tables...")
            db.create_all()
            logger.info("Database tables created successfully")
        except Exception as e:
            logger.error(f"Error creating database tables: {e}")
            raise

if __name__ == "__main__":
    try:
        # Create Flask app
        app = create_app()
        
        # Initialize database
        init_database(app)
        
        # Log startup
        logger.info("Starting Flask server...")
        logger.info(f"Database URI: {app.config['SQLALCHEMY_DATABASE_URI']}")
        logger.info(f"CORS origins: ['http://localhost:3000', 'http://localhost:5173']")
        
        # Run app
        app.run(
            host='127.0.0.1',
            port=5000,
            debug=True,
            use_reloader=True
        )
    except Exception as e:
        logger.error(f"Failed to start server: {e}")
        raise