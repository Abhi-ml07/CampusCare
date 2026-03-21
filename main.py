from flask import Flask, render_template, request, redirect, url_for
from datetime import datetime
from flask import session
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os,bcrypt
import pandas as pd
import requests
from pymongo import MongoClient

load_dotenv()

app = Flask(__name__)
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.secret_key = os.getenv("SECRET_KEY", "dev-secret")
mongo = PyMongo(app)

CSV_URL = os.getenv("CSV_URL")
def sync_sheet_to_mongo():
    response = requests.get(CSV_URL)
    df = pd.read_csv(pd.io.common.BytesIO(response.content))

    df.columns = df.columns.str.strip()

    collection = mongo.db.responses

    for _, row in df.iterrows():
        data = row.to_dict()

        unique_id = str(hash(frozenset(data.items())))

        if not collection.find_one({"_id": unique_id}):
            data["_id"] = unique_id
            collection.insert_one(data)
            print("Inserted:", data)
            
            
@app.route("/sync")
def sync():
    count = sync_sheet_to_mongo()
    return f"{count} new records inserted!"



# -------------

@app.route("/base")
def base():
    return render_template("base.html")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/dashboard")
def dashboard():
    if 'user' not in session:
        return redirect(url_for('login'))
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
        student_code = request.form.get("student_code")
        phone = request.form.get("phone")
        email = request.form.get("email")
        password = request.form.get("password")

        # Check existing user
        existing_user = mongo.db.users.find_one({
            "$or": [
                {"email": email},
                {"student_code": student_code}
            ]
        })

        if existing_user:
            return render_template("register.html", error="User already exists!")

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

        mongo.db.users.insert_one({
            "name": name,
            "student_code": student_code,
            "phone": phone,
            "email": email,
            "password": hashed_password
        })

        return redirect(url_for('login'))

    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        identifier = request.form.get("student_code")  # ✅ FIXED
        password = request.form.get("password")

        user = mongo.db.users.find_one({
            "$or": [
                {"email": identifier},
                {"student_code": identifier}
            ]
        })

        if user and bcrypt.checkpw(password.encode("utf-8"), user["password"]):
            session['user'] = user.get('name') or user.get('email')
            return redirect(url_for('dashboard'))
        else:
            return render_template("login.html", error="Invalid Student Code/Email or Password")

    return render_template("login.html")

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return redirect(url_for('home'))


if __name__ == "__main__":
    app.run(debug=True)