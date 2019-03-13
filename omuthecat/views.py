from django.shortcuts import render

from os import listdir
from random import randint

# Create your views here.
def render_home(request):

    # get random file from images/omu
    omu_image_folder = 'static/images/omu/'
    image_filenames = listdir(omu_image_folder)
    filename = image_filenames[ randint( 0, len(image_filenames) - 1 ) ]

    context = {
        'filename': filename
    }

    return render(request, "home.html", context)