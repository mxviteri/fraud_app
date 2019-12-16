from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle

app = Flask(__name__,
    static_folder='client/build/static',
    template_folder='client/build')

CORS(app)

test = None
model = None
maps = {'card4': [('visa', 3), ('mastercard', 2), ('american express', 0), ('discover', 1)], 'ProductCD': [('W', 4), ('H', 1), ('C', 0), ('S', 3), ('R', 2)], 'card6': [('credit', 1), ('debit', 2), ('debit or credit', 3), ('charge card', 0)], 'P_emaildomain': [('gmail.com', 16), ('outlook.com', 35), ('yahoo.com', 53), ('mail.com', 29), ('anonymous.com', 1), ('hotmail.com', 19), ('verizon.net', 48), ('aol.com', 2), ('me.com', 30), ('comcast.net', 9), ('optonline.net', 34), ('cox.net', 10), ('charter.net', 8), ('rocketmail.com', 42), ('prodigy.net.mx', 37), ('embarqmail.com', 12), ('icloud.com', 23), ('live.com.mx', 26), ('gmail', 15), ('live.com', 25), ('att.net', 3), ('juno.com', 24), ('ymail.com', 58), ('sbcglobal.net', 43), ('bellsouth.net', 4), ('msn.com', 31), ('q.com', 40), ('yahoo.com.mx', 54), ('centurylink.net', 6), ('servicios-ta.com', 45), ('earthlink.net', 11), ('hotmail.es', 21), ('cfl.rr.com', 7), ('roadrunner.com', 41), ('netzero.net', 33), ('gmx.de', 17), ('suddenlink.net', 46), ('frontiernet.net', 14), ('windstream.net', 50), ('frontier.com', 13), ('outlook.es', 36), ('mac.com', 28), ('netzero.com', 32), ('aim.com', 0), ('web.de', 49), ('twc.com', 47), ('cableone.net', 5), ('yahoo.fr', 57), ('yahoo.de', 55), ('yahoo.es', 56), ('sc.rr.com', 44), ('ptd.net', 39), ('live.fr', 27), ('yahoo.co.uk', 52), ('hotmail.fr', 22), ('hotmail.de', 20), ('hotmail.co.uk', 18), ('protonmail.com', 38), ('yahoo.co.jp', 51)]}

# serving the static react frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    return render_template('index.html')

@app.route('/api/fraud', methods=['post'])
def prediction():
    global test
    global model

    if test is None:
        test = pd.read_csv('./data/scaleddownsampletest.csv')

    if model is None:
        with open('./data/final_model.pkl', 'rb') as f:
            model = pickle.load(f)


    body = request.json

    not_fraud = test[1:2].copy()
    fraud = test[61:62].copy()

    t = 'Not Fraudulent'
    row = not_fraud
    email = body['email']
    if "protonmail.com" in email:
        t = 'Fraudulent'
        row = fraud

    cols = ['ProductCD', 'card4', 'card6', 'P_emaildomain']
    vals = [body['product'], body['card4'], body['card6'], email]
    convert = zip(cols, vals)

    # for item in convert:
    #     mappedVal = 0
    #     col = item[0]
    #     mapped = maps[col]
    #     for i in mapped:
    #         if (i[0] == item[1]):
    #             mappedVal = i[1]
    #     row[col] = mappedVal

    pred = model.predict_proba(row)

    return jsonify({
        'type': t,
        'score': list(pred[0])
    })

if __name__ == '__main__':
    app.run()