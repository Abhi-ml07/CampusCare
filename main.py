from bson import ObjectId
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

@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/dashboard")
def dashboard():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template("dash.html")


@app.route("/update_issue_status/<issue_id>", methods=["POST"])
def update_issue_status(issue_id):
    if 'user' not in session or session.get("role") != "admin":
        return redirect(url_for("login"))

    new_status = request.form.get("status")

    if new_status not in ["Pending", "Process", "Resolved"]:
        issues = list(mongo.db.issues.find().sort("created_at", -1))
        return render_template("admin_dash.html", issues=issues, error="Invalid status selected")

    mongo.db.issues.update_one(
        {"_id": ObjectId(issue_id)},
        {"$set": {"status": new_status}}
    )

    return redirect(url_for("admin_dashboard"))


@app.route("/response", methods=["GET", "POST"])
def response():
    if request.method == "POST":
        category = request.form.get("category")
        subcategory = request.form.get("subcategory")
        status = request.form.get("status")
        affected = request.form.get("affected")
        critical_value = request.form.get("critical")
        duration = request.form.get("duration")
        location = request.form.get("location")
        description = request.form.get("description")

        # Handle severity safely
        if critical_value:
            severity = int(critical_value)
        else:
            severity = 1

        # Insert into MongoDB
        mongo.db.issues.insert_one({
            "category": category,
            "subcategory": subcategory,
            "status": "Pending",   # override default system status
            "user_status": status, # what user selected
            "students_affected": affected,
            "severity": severity,
            "duration": duration,
            "location": location,
            "description": description,
            "likes": 0,
            "created_at": datetime.utcnow()
        })
        return render_template("response.html", success="Your issue has been reported!")
    return render_template("response.html")

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
        password = request.form.get("password").encode('utf-8')

        if mongo.db.users.find_one({"email": email}):
            return render_template("register.html", error="Email already registered")

        hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())
        mongo.db.users.insert_one({
            "name": name,
            "email": email,
            "password": hashed_password,
            "role": "user"
        })
        return redirect(url_for("login"))
    return render_template("register.html")


@app.route("/adminregister", methods=["GET", "POST"])
def adminregister():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        password = request.form.get("password").encode('utf-8')

        if mongo.db.users.find_one({"email": email}):
            return render_template("adminreg.html", error="Email already registered")

        hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())
        mongo.db.users.insert_one({
            "name": name,
            "email": email,
            "password": hashed_password,
            "role": "admin"
        })
        return redirect(url_for("admin_login"))
    return render_template("adminreg.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password").encode('utf-8')

        user = mongo.db.users.find_one({"email": email})
        if user and bcrypt.checkpw(password, user["password"]):
            session["user"] = user["name"]
            session["email"] = user["email"]
            session["role"] = user.get("role", "user")
            return redirect(url_for("dashboard"))
        else:
            return render_template("login.html", error="Invalid email or password")
    return render_template("login.html")


@app.route("/admin")
def admin_dashboard():
    if 'user' not in session or session.get("role") != "admin":
        return redirect(url_for("login"))
    issues = list(mongo.db.issues.find().sort("created_at", -1))
    return render_template("admin_dash.html", issues=issues)


@app.route("/admin_login", methods=["GET", "POST"])
def admin_login():
    if request.method == "POST":
        email = request.form.get("Email")
        password = request.form.get("password").encode('utf-8')

        user = mongo.db.users.find_one({"email": email})
        if user and bcrypt.checkpw(password, user["password"]) and user.get("role") == "admin":
            session["user"] = user["name"]
            session["email"] = user["email"]
            session["role"] = user.get("role", "user")
            return redirect(url_for("admin_dashboard"))
        else:
            return render_template("adminlogin.html", error="Invalid email or password")
    return render_template("adminlogin.html")


@app.route("/like_issue/<issue_id>", methods=["POST"])
def like_issue(issue_id):
        if 'user' not in session:
            return redirect(url_for("login"))
        mongo.db.issues.update_one(
            {"_id": ObjectId(issue_id)},
            {"$inc": {"likes": 1}}
        )

@app.route("/logout", methods=["POST"])
def logout():
    session.pop("user", None)
    session.pop("email", None)
    session.pop("role", None)
    return redirect(url_for("home"))


if __name__ == "__main__":
    app.run(debug=True)