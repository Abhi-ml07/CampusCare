from flask import Flask, render_template, request, redirect, url_for
from datetime import datetime
from flask import session
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os,bcrypt
load_dotenv()

app = Flask(__name__)
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.secret_key = os.getenv("SECRET_KEY", "dev-secret")
mongo = PyMongo(app)

# -------------

@app.route("/base")
def base():
    return render_template("base.html")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/dashboard")
def dashboard():
    return render_template("dash.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/contact/submit", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        message = request.form.get("message")

        mongo.db.contacts.insert_one({
            "name": name,
            "email": email,
            "message": message
        })

        return render_template("contact.html",success="Your message has been sent!")
    return render_template("contact.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        password = request.form.get("password")

        existing_user = mongo.db.users.find_one({"email": email})
        if existing_user:
            return "Email already registered!"

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        mongo.db.users.insert_one({
            "name": name,
            "email": email,
            "password": hashed_password
        })

        return render_template("login.html", success="Account created successfully!")
    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        user = mongo.db.users.find_one({"email": email})

        if user and bcrypt.checkpw(password.encode("utf-8"), user["password"]):
            session['user'] = user.get('name') or user.get('email')
            session['just_logged_in'] = True
            return redirect(url_for('login'))
        else:
            return render_template("login.html", error="Invalid email or password.")
    success = None
    if session.pop('just_logged_in', None):
        success = "Login successful!"
    return render_template("login.html", success=success)

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return redirect(url_for('home'))


if __name__ == "__main__":
    app.run(debug=True)