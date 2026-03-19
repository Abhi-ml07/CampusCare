from flask import Flask, render_template, request, redirect, url_for
from datetime import datetime
from flask import pymongo


app = Flask(__name__)


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


@app.route("/contact", methods=["GET", "POST"])
def contact():
    return render_template("contact.html")


@app.route('/contact/submit', methods=['POST'])
def contact_submit():
    name = request.form.get('name')
    email = request.form.get('email')
    message = request.form.get('message')
    print(f"Contact form submitted: name={name!r}, email={email!r}, message={message!r}")
    return redirect(url_for('contact'))


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        # Handle registration logic here
        pass
    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        # Handle login logic here
        pass
    return render_template("login.html")




if __name__ == "__main__":
    app.run(debug=True)