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
    pass


@app.route("/login", methods=["GET", "POST"])
def login():
    pass


@app.route("/admin")
def admin_dashboard():
    if 'user' not in session or session.get("role") != "admin":
        return redirect(url_for("login"))
    issues = list(mongo.db.issues.find().sort("created_at", -1))
    return render_template("admin_dash.html", issues=issues)


@app.route("/admin_login", methods=["GET", "POST"])
def admin_login():
    pass

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