from django.http import HttpResponse
from django.shortcuts import render
from os import listdir
from random import randint

# Create your views here.
def render_home(request):

    image_folder = 'omu/'

    context = {
        'filename': get_random_image(image_folder),
        'filenames': [ filename for filename in listdir('static/images/{}'.format(image_folder)) ]
    }

    print(context)

    return render(request, "home.html", context)


def change_picture(request):
    image_folder = 'omu/'
    return HttpResponse(get_random_image(image_folder))


def get_random_image(image_folder):
    path = 'static/images/{}'.format(image_folder)
    filenames = listdir(path)
    return filenames[ randint( 0, len(filenames) - 1 ) ]