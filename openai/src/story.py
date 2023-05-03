import openai
import os
import json

BACKGROUND = """
In a medieval fantasy world of magic, people live with other creatures.
"""
INIT_PROMPT = ("There is a world background: "
               f"{BACKGROUND}"
               "you need to generate role setting based on the background, and some role's feature I will give to you.\n"
               "here is the extra prompt: ")
PRE_PROMPT = "generate another role same way as before, better has relation with previous role, and here is the new role's feature: "

messages = [{"role": "user", "content": INIT_PROMPT}]


def gen_store(feature):
    openai.api_key = os.environ['OPENAI_API_KEY']
    openai.debug = True

    messages.append({"role": "user", "content": feature if len(
        messages) == 1 else PRE_PROMPT + feature})
    messages.append(
        {"role": "user", "content": "imitating the character you created, say hi and introduce yourself, 40 words"})
    print("prompt===", messages)

    # 访问OpenAI接口
    response = openai.ChatCompletion.create(
        model='gpt-3.5-turbo',
        messages=messages
    )
    resText = response.choices[0].message.content
    messages.append({"role": "assistant", "content": resText})

    return resText
