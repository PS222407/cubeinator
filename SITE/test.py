from flask import Flask,render_template,Response, jsonify, request, send_file
import cv2
from PIL import Image
from math import sqrt
import numpy as np
import io
app=Flask(__name__)
width=640
height=360
textwidth = 180
cube = []
top = [] 
front = []
bottom = []
back = []
right = []
left = []
count = 1
succes = False
gocode = False
cam=cv2.VideoCapture(0)
globalframe = []
text = "laat bovenkant zien"
data_top = [
    [[255,255,255]]
]
data_front = [
    [[255,255,255]]
]
data_bottom = [
    [[255,255,255]]
]
data_back = [
    [[255,255,255]]
]
data_right = [
    [[255,255,255]]
]
data_left = [
    [[255,255,255]]
]
def generate_frames():
    global globalframe
    while True:
            
        ## read the camera frame
        success,frame=cam.read()
        if not success:
            break
        else:
            cv2.rectangle(frame,(245,105), (395,255),(0,0,0),3)
            cv2.circle(frame, (270,130), 5 , (180,105,255),2)
            cv2.circle(frame, (320,130), 5, (180,105,255), 2)
            cv2.circle(frame, (370,130), 5, (180,105,255), 2)

            cv2.circle(frame, (270,180), 5, (180,105,255), 2)
            cv2.circle(frame, (320,180), 5, (180,105,255), 2)
            cv2.circle(frame, (370,180), 5, (180,105,255), 2)

            cv2.circle(frame, (270,230), 5, (180,105,255), 2)
            cv2.circle(frame, (320,230), 5, (180,105,255), 2)
            cv2.circle(frame, (370,230), 5, (180,105,255), 2)
            cv2.putText(frame, text, (textwidth,60), cv2.FONT_HERSHEY_COMPLEX,0.8,(0,0,0),2)
            globalframe = frame
            
           
            ret,buffer=cv2.imencode('.jpg',frame)
            frame=buffer.tobytes()
            key = cv2.waitKey(1)
            if key & 0xff ==ord('q'):
                break
        
               


        yield(b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route("/", methods=['GET', 'POST'])
def index():
    return render_template("index.html", cube = [0])

@app.route('/video')
def video():
    return Response(generate_frames(),mimetype='multipart/x-mixed-replace; boundary=frame')
@app.route('/topp')
def topp():
    # my numpy array 
    arr = np.array(data_top)

    # convert numpy array to PIL Image
    img = Image.fromarray(arr.astype('uint8'))

    # create file-object in memory
    file_object = io.BytesIO()

    # write PNG in file-object
    img.save(file_object, 'PNG')

    # move to beginning of file so `send_file()` it will read from start    
    file_object.seek(0)

    return send_file(file_object, mimetype='image/PNG')

@app.route('/frontt')
def frontt():
    # my numpy array 
    arr = np.array(data_front)

    # convert numpy array to PIL Image
    img = Image.fromarray(arr.astype('uint8'))

    # create file-object in memory
    file_object = io.BytesIO()

    # write PNG in file-object
    img.save(file_object, 'PNG')

    # move to beginning of file so `send_file()` it will read from start    
    file_object.seek(0)

    return send_file(file_object, mimetype='image/PNG')

@app.route('/bottomm')
def bottomm():
    # my numpy array 
    arr = np.array(data_bottom)

    # convert numpy array to PIL Image
    img = Image.fromarray(arr.astype('uint8'))

    # create file-object in memory
    file_object = io.BytesIO()

    # write PNG in file-object
    img.save(file_object, 'PNG')

    # move to beginning of file so `send_file()` it will read from start    
    file_object.seek(0)

    return send_file(file_object, mimetype='image/PNG')

@app.route('/backk')
def backk():
    # my numpy array 
    arr = np.array(data_back)

    # convert numpy array to PIL Image
    img = Image.fromarray(arr.astype('uint8'))

    # create file-object in memory
    file_object = io.BytesIO()

    # write PNG in file-object
    img.save(file_object, 'PNG')

    # move to beginning of file so `send_file()` it will read from start    
    file_object.seek(0)

    return send_file(file_object, mimetype='image/PNG')
@app.route('/rightt')
def rightt():
    # my numpy array 
    arr = np.array(data_right)

    # convert numpy array to PIL Image
    img = Image.fromarray(arr.astype('uint8'))

    # create file-object in memory
    file_object = io.BytesIO()

    # write PNG in file-object
    img.save(file_object, 'PNG')

    # move to beginning of file so `send_file()` it will read from start    
    file_object.seek(0)

    return send_file(file_object, mimetype='image/PNG')
@app.route('/leftt')
def leftt():
    # my numpy array 
    arr = np.array(data_left)

    # convert numpy array to PIL Image
    img = Image.fromarray(arr.astype('uint8'))

    # create file-object in memory
    file_object = io.BytesIO()

    # write PNG in file-object
    img.save(file_object, 'PNG')

    # move to beginning of file so `send_file()` it will read from start    
    file_object.seek(0)

    return send_file(file_object, mimetype='image/PNG')
@app.route("/scan", methods=['GET', 'POST'])
def scan():
    global text
    global textwidth
    global count
    global succes
    global data_top
    global data_front
    global data_bottom
    global data_back
    global data_right
    global data_left
    print(request.method)
    test = False
    if request.method == 'POST':
      
        if request.form.get('Scan') == 'Scan':
            color = [globalframe[130][270], globalframe[130][320], globalframe[130][370], globalframe[180][270], globalframe[180][320], globalframe[180][370], globalframe[230][270], globalframe[230][320], globalframe[230][370]]
            colorcode = []
            check = True
            def emptyarray():
                if (count == 1):
                    top.clear()
                    print(top)
                elif (count == 2):
                    front.clear()
                elif (count == 3 ):
                    bottom.clear()
                elif (count == 4):
                    back.clear()
                elif (count == 5):
                    right.clear()
                elif (count == 6):
                    left.clear()
            emptyarray()
            def addcolor(col):
                if (count == 1):
                    top.append(col)
                elif (count == 2):
                    front.append(col)
                elif (count == 3 ):
                    bottom.append(col)
                elif (count == 4):
                    back.append(col)
                elif (count == 5):
                    right.append(col)
                elif (count == 6):
                    left.append(col)
            COLORS = (
                (26, 51, 82),#blue
                (120, 154, 53),#green
                (153, 71, 68),#red
                (125, 125, 125),#white
                (159,93,69),#orange
                (141,132,39),#yellow
            )

            def closest_color(rgb):
                r, g, b = rgb
                color_diffs = []
                for color in COLORS:
                    cr, cg, cb = color
                    color_diff = sqrt(abs(r - cr)**2 + abs(g - cg)**2 + abs(b - cb)**2)
                    color_diffs.append((color_diff, color))
                return min(color_diffs)[1]
            print(color)
            for x in color:
                
                color = closest_color((x[2], x[1], x[0]))
                if color == (153, 71, 68):
                    addcolor("r")
                    colorcode.append([255,0,0])
                elif color == (26, 51, 82):
                    addcolor("b")
                    colorcode.append([0,0,255])
                elif color == (120, 154, 53):
                    addcolor("g")
                    colorcode.append([0,255,0])
                elif color == (125, 125, 125):
                    addcolor("w")
                    colorcode.append([255,255,255])
                elif color == (141,132,39):
                    addcolor("y")
                    colorcode.append([255,255,0])
                elif color == (159,93,69):
                    addcolor("o")
                    colorcode.append([255,165,0])
                print(color)
                # if (x[0] > x[1] and x[0] > x[2]) and x[1] < 100 and x[2] < 70:
                #     addcolor("b")  
                #     colorcode.append([0,0,255])
                # elif (x[2] > x[0] and x[2] > x[1]) and x[0] < 70 and x[1] < 70:
                #     addcolor('r')
                #     colorcode.append([255,0,0]) 
                # elif (x[1] > x[0] and x[1] > x[2]) and x[2] < 120 and x[0] < 70:
                #     addcolor('g')
                #     colorcode.append([0,255,0])                 
                # elif x[2] > 120 and x[1] > 120 and x[0] < 50:
                #     addcolor('y')
                #     colorcode.append([255,255,0])                 
                # elif x[2] > 150 and x[1] > 50 and x[0] < 75:
                #     addcolor('o')
                #     colorcode.append([255,165,0])                 
                # elif x[0] > 100 and x[1] > 100 and x[2] > 100:
                #     addcolor('w')
                #     colorcode.append([255,255,255])                 
                # else:
                #     addcolor(x)
                #     colorcode.append([0,0,0])  
                #     check = False                

            if (check):       
                print(top)
                print(front)
                print(bottom)
                print(back)
                print(right)
                print(left)
                succes = True
                text = "geslaagd klik op enter om door te gaan"
                textwidth = 50
            else:
                text = "probeer opnieuw" 
                print(color)
                test = True
            put=np.zeros([300,300,3],dtype=np.uint8)
            put[0:100,0:100]=colorcode[0]
            put[0:100,100:200]=colorcode[1]
            put[0:100,200:300]=colorcode[2]
            put[100:200,0:100]=colorcode[3]
            put[100:200,100:200]=colorcode[4]
            put[100:200,200:300]=colorcode[5]
            put[200:300,0:100]=colorcode[6]
            put[200:300,100:200]=colorcode[7]
            put[200:300,200:300]=colorcode[8]
            put[0:100,0:100]=colorcode[0]
            put[0:300,0:2]=[0,0,0]
            put[0:300,98:102]=[0,0,0]
            put[0:300,198:202]=[0,0,0]
            put[0:300,298:300]=[0,0,0]
            put[0:2,0:300]=[0,0,0]
            put[98:102,0:300]=[0,0,0]
            put[198:202,0:300]=[0,0,0]
            put[298:300,0:300]=[0,0,0]



            if (count == 1):
                data_top = put
            elif (count == 2):
                data_front = put
            elif (count == 3 ):
                data_bottom = put
            elif (count == 4):
                data_back = put
            elif (count == 5):
                data_right = put
            elif (count == 6):
                data_left = put
        
            return render_template("scan.html", **locals())
        elif  request.form.get('Volgende') == 'Volgende':
            if (succes):
                count += 1
                if (count == 2):
                    text = "Laat voorkant zien!"
                elif (count == 3):
                    text = "Laat onderkant zien!"
                elif (count == 4):
                    text = "Laat achterkant zien!"
                elif (count == 5):
                    text = "Laat rechterkant zien!"
                elif (count == 6):
                    text = "Laat linkerkant zien!"
                elif (count == 7):
                    
                    cube.append(top)
                    cube.append(front)
                    cube.append(bottom)
                    cube.append(back)
                    cube.append(right)
                    cube.append(left)
                    print(cube)
                    return render_template("index.html", cube = cube)
    
    elif request.method == 'GET':
        # return render_template("index.html")
        print("No Post Back Call")
    if not test:
        return render_template("scan.html", top = top)



############################################################################################
######################################### JENS #############################################
############################################################################################
import kociemba

@app.route("/state/<state>")
def solveCube(state):
    return render_template("kociemba.html", state = kociemba.solve(state))
    # return f"Solve: {kociemba.solve(state)}"


# if __name__ == "__main__":
#     app.run()

# URFDLB

# DRLUUBFBRBLURRLRUBLRDDFDLFUFUFFDBRDUBRUFLLFDDBFLUBLRBD





#DONT REMOVE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
if __name__=="__main__":
    app.run(debug=True)