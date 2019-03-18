from django.middleware.csrf import get_token
from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect

from operator import itemgetter
from os import listdir
from random import randint

from .api import get_all_entries


################## page views

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
        print("\nAn exception occurred.")
        print("Exception type: {}".format(type(e)))
        print(str(e))
        logger.error(str(e))


    # replace click score with message if nobody has clicked yet
    if highest_scoring_entry['clicker_id'] == 'null' or highest_scoring_entry['clicks'] == 0:
        highest_scoring_entry['clicks'] ='Start clicking!'
        number_of_entries = 'No'

    context = {
        'csrftoken': get_token(request),
        'highest_scoring_entry': highest_scoring_entry['clicks'],
        'number_of_entries': number_of_entries,
        'number_of_clicks': number_of_clicks,
        'filename': filename,
        'filenames': filenames
    }

    return render(request, 'home.html', context)


################## utilities

def get_random_image(image_folder):
    """
        image_folder - (string) - relative filepath to images of omu
        return value - random filename from within image_folder filepath
    """
    path = 'static/images/{}'.format(image_folder)
    filenames = listdir(path)
    return filenames[ randint( 0, len(filenames) - 1 ) ]

def get_highest_scoring_entry(entries):
    """
        entries - { clicker_id : clicks, ... }
        return value - { clicker_id : clicks } with highest clicks value
    """
    if len(entries) >= 1:
        highest_scoring_entry = {
            'clicker_id': max( entries.items(), key=itemgetter(1) )[0],
            'clicks': entries[ max( entries.items(), key=itemgetter( 1 ) )[ 0 ] ]
        }
    else:
        # note - handle case of 0 clicks in rendering view
        highest_scoring_entry = { 'clicker_id': 'null', 'clicks': 0 }

    # { clicker_id : clicks }
    return highest_scoring_entry

def get_number_of_entries(entries):
    """
        entries - { clicker_id : clicks, ... }
        return value - number of pairs in entries dictionary
    """
    return len(entries.items())

def get_number_of_clicks(entries):
    """
        entries - { clicker_id : clicks, ... }
        return value - (int) total sum of all clicks from DesktopClickLog and MobileClickLog
    """
    return sum( [ entry for entry in entries.values() ] )


def determine_if_bot(entries):
    """
        entries - { clicker_id : clicks, ... }
        return value - (int) total sum of all clicks from DesktopClickLog and MobileClickLog
    """