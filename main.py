from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/base")
def base():
    return render_template("base.html")


@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")


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