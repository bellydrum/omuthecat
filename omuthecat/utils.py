from operator import itemgetter
from random import randint


################## utilities for use in views.py

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
