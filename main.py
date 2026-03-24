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
        category = request.form.get("category")
        name = request.form.get("name")
        student_code = request.form.get("student_code")
        phone = request.form.get("phone")
        email = request.form.get("email")
        password = request.form.get("password")

        if not category:
            return render_template("register.html", error="Please select user type")

        if not name or not phone or not email or not password:
            return render_template("register.html", error="Please fill all required fields")

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

        if category == "Student":
            if not student_code:
                return render_template("register.html", error="Student code is required for students")

            existing_user = mongo.db.users.find_one({
                "$or": [
                    {"email": email},
                    {"student_code": student_code}
                ]
            })

            if existing_user:
                return render_template("register.html", error="Student already exists")

            mongo.db.users.insert_one({
                "name": name,
                "student_code": student_code,
                "phone": phone,
                "email": email,
                "password": hashed_password,
                "role": "student",
                "created_at": datetime.utcnow()
            })

            return render_template("register.html", created=True)

        elif category == "Admin":
            if session.get("role") != "admin":
                return render_template("register.html", error="Only admin can create admin account")

            existing_admin = mongo.db.admin.find_one({
                "email": email
            })

            if existing_admin:
                return render_template("register.html", error="Admin already exists")

            mongo.db.admin.insert_one({
                "name": name,
                "phone": phone,
                "email": email,
                "password": hashed_password,
                "role": "admin",
                "created_at": datetime.utcnow()
            })

            return render_template("register.html", created=True)

        else:
            return render_template("register.html", error="Invalid user type")

    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        category = request.form.get("category")
        identifier = request.form.get("student_code")
        password = request.form.get("password")

        if category == "Student":
            user = mongo.db.users.find_one({
                "$or": [
                    {"email": identifier},
                    {"student_code": identifier}
                ]
            })

            if user and bcrypt.checkpw(password.encode("utf-8"), user["password"]):
                session["user"] = user.get("name")
                session["email"] = user.get("email")
                session["role"] = "student"
                return redirect(url_for("dashboard"))
            else:
                return render_template("login.html", error="Invalid student login details")

        elif category == "Admin":
            admin = mongo.db.admin.find_one({
                "email": identifier
            })

            if admin and bcrypt.checkpw(password.encode("utf-8"), admin["password"]):
                session["user"] = admin.get("name")
                session["email"] = admin.get("email")
                session["role"] = "admin"
                return redirect(url_for("admin_dashboard"))
            else:
                return render_template("login.html", error="Invalid admin login details")

        return render_template("login.html", error="Please select user type")

    return render_template("login.html")


@app.route("/logout", methods=["POST"])
def logout():
    session.pop("user", None)
    session.pop("email", None)
    session.pop("role", None)
    return redirect(url_for("home"))


if __name__ == "__main__":
    app.run(debug=True)