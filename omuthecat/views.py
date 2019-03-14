from django.http import HttpResponse
from django.shortcuts import render
from os import listdir
from random import randint

from .models import *

################## page views

def render_home(request):

    image_folder = 'omu/'

    context = {
        'filename': get_random_image(image_folder),
        'filenames': listdir('static/images/{}'.format(image_folder))
    }

    return render(request, "home.html", context)


################## utility views

def get_random_image(image_folder):
    path = 'static/images/{}'.format(image_folder)
    filenames = listdir(path)
    return filenames[ randint( 0, len(filenames) - 1 ) ]

def log_clicks(request):
    if request.method == 'POST':
        clicks = int(request.POST['clicks'])

        # store log of clicks
        log = ClickLog(number_of_clicks=clicks)
        log.save()

        return HttpResponse( { 'status': 'OK' } )