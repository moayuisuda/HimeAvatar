from flask import Flask, jsonify, request
import requests
import story

app = Flask(__name__)
print(__name__)


@app.route('/get-image', methods=['POST'])
def get_image():
    data = request.get_json()
    print(data)
    response = requests.get('https://jsonplaceholder.typicode.com/posts')
    return jsonify(response.json())


@app.route('/get-story', methods=['GET'])
def get_story():
    feature = request.args.get('feature')
    return story.gen_store(feature)


if __name__ == '__main__':
    app.run()


# @app.route('/get-story/<string:prompt>', methods=['GET'])
# def get_story(prompt):
#     return story.gen_store(prompt)


# if __name__ == '__main__':
#     app.run()
