from flask import Flask
import kociemba

app = Flask(__name__)

@app.route("/")
def home():
    return "Hellow world main page"

@app.route("/state/<state>")
def solveCube(state):
    return f"Solve: {kociemba.solve(state)}"

if __name__ == "__main__":
    app.run()

# URFDLB

# DRLUUBFBRBLURRLRUBLRDDFDLFUFUFFDBRDUBRUFLLFDDBFLUBLRBD