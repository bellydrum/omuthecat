from django.middleware.csrf import get_token
from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect

from os import listdir
from random import randint


################## page views

@csrf_protect
def render_home(request):

    image_folder = 'omu/'
    filename = get_random_image(image_folder)
    filenames = listdir('static/images/{}'.format(image_folder))

    context = {
        'csrftoken': get_token(request),
        'filename': filename,
        'filenames': filenames
    }

    return render(request, "home.html", context)



################## utilities

def get_random_image(image_folder):
    path = 'static/images/{}'.format(image_folder)
    filenames = listdir(path)
    return filenames[ randint( 0, len(filenames) - 1 ) ]