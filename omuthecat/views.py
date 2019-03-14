from django.middleware.csrf import get_token
from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect

from os import listdir
from random import randint

from .api import get_high_score


################## page views

@csrf_protect
def render_home(request):

    # initialize constants
    image_folder = 'omu/'
    filename = get_random_image(image_folder)
    filenames = listdir('static/images/{}'.format(image_folder))

    # get click high score
    high_score = get_high_score(request)

    context = {
        'csrftoken': get_token(request),
        'high_score': high_score,
        'filename': filename,
        'filenames': filenames
    }

    return render(request, 'home.html', context)



################## utilities

def get_random_image(image_folder):
    path = 'static/images/{}'.format(image_folder)
    filenames = listdir(path)
    return filenames[ randint( 0, len(filenames) - 1 ) ]