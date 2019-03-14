from django.http import HttpResponse
from django.shortcuts import render
from os import listdir
from random import randint

from .models import *

# Create your views here.
def render_home(request):

    image_folder = 'omu/'

    context = {
        'filename': get_random_image(image_folder),
        'filenames': listdir('static/images/{}'.format(image_folder))
    }

    return render(request, "home.html", context)


def change_picture(request):
    image_folder = 'omu/'
    return HttpResponse(get_random_image(image_folder))

def get_random_image(image_folder):
    path = 'static/images/{}'.format(image_folder)
    filenames = listdir(path)
    return filenames[ randint( 0, len(filenames) - 1 ) ]

def log_clicks(request):
    if request.method == 'POST':
        clicks = request.POST['clicks']

        ClickLog(clicks=clicks).save()
        print('Saved.')