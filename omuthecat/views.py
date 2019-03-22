from django.middleware.csrf import get_token
from django.shortcuts import render
from django.views.decorators.cache import cache_control
from django.views.decorators.csrf import csrf_protect

from os import listdir

from .api import get_all_entries
from .utils import *


################## page views

@cache_control(private=True)
@csrf_protect
def render_home(request):

    # initialize constants
    image_folder = 'omu/'
    filename = get_random_image(image_folder)
    filenames = listdir('static/images/{}'.format(image_folder))

    try:
        # get highest click score and number of clickers
        all_entries = get_all_entries(request)
        highest_scoring_entry = get_highest_scoring_entry(all_entries)
        number_of_entries = get_number_of_entries(all_entries)
        number_of_clicks = get_number_of_clicks(all_entries)
    except Exception as e:
        highest_scoring_entry = 'Error'
        number_of_entries = 'Error'
        number_of_clicks = 'Error'
        print("\nAn exception occurred.")
        print("Exception type: {}".format(type(e)))
        print(str(e))
        logger.error(str(e))


    # replace click score with message if nobody has clicked yet
    if highest_scoring_entry['clicker_id'] == 'null' or highest_scoring_entry['clicks'] == 0:
        highest_scoring_entry['clicks'] = 0
        number_of_entries = 'No'

    context = {
        'csrftoken': get_token(request),
        'highest_scoring_entry': highest_scoring_entry['clicks'],
        'number_of_entries': number_of_entries,
        'number_of_clicks': number_of_clicks,
        'filename': filename,
        'filenames': filenames,
    }

    return render(request, 'home.html', context)