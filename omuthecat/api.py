from django.db.models import Count
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_protect

from collections import Counter
import logging

from .models import DesktopClickLog, MobileClickLog


# create logger for homepage
logger = logging.getLogger(__name__)


################## called by views.py

@csrf_protect
def get_all_entries(request):
    """ returns dictionary { 'clicker_id' : 'clicks' } of all unique click_ids in DesktopClickLog and MobileClickLog """

    # gather scores in { clicker_id : clicks } format
    try:
        desktop_entries = [
            { 'clicker_id': i.clicker_id, 'clicks': i.clicks }
            for i in DesktopClickLog.objects.annotate(score=Count('clicks'))
        ]
    except Exception as e:
        print('An exception occurred in api.get_all_entries trying to get all desktop entries.')
        print(str(e))
        logger.error(str(e))

    try:
        mobile_entries = [
            {'clicker_id': i[0], 'clicks': i[1] }
            for i in Counter([i['clicker_id'] for i in MobileClickLog.objects.values('clicker_id')]).items()
        ]
    except Exception as e:
        print('An exception occurred in api.get_all_entries trying to get all mobile entries.')
        print(str(e))
        logger.error(str(e))

    # put all entries into a single dictionary
    try:
        all_entries = {
            entry['clicker_id'] : entry['clicks']
            for entry in [ i for i in ( desktop_entries + mobile_entries ) ]
        }
        return all_entries
    except Exception as e:
        print('An exception occurred in api.get_all_entries trying to combine desktop and mobile entries.')
        print(str(e))
        logger.error(str(e))



################## called by urls.py

@csrf_protect
def post_clicks(request):
    if request.method == 'POST':

        # log desktop clicks
        if 'clicker_id' in request.POST.keys() and 'clicks' in request.POST.keys():

            # get or create user
            try:
                existing_user = DesktopClickLog.objects.get(clicker_id=request.POST['clicker_id'])
            except DesktopClickLog.DoesNotExist:
                existing_user = None
            except Exception as e:
                print('An exception occurred in api.post_clicks trying to get or create existing_user.')
                print(str(e))
                logger.error(str(e))

            # if the clicker_id already exists in DesktopMobileLog
            try:
                if existing_user is not None:
                    existing_user.clicks += int(request.POST['clicks'])
                else:
                    existing_user = DesktopClickLog(
                        clicker_id=request.POST['clicker_id'],
                        clicks=request.POST['clicks']
                    )
                existing_user.save()
            except Exception as e:
                print('An exception occurred in api.post_clicks trying to increment existing_user clicks in db.')
                print(str(e))
                logger.error(str(e))

            return HttpResponse( { 'status': 'OK', 'type': 'desktop' } )

        # log mobile clicks
        elif 'clicker_id' in request.POST.keys() and 'clicks' not in request.POST.keys():

            try:
                log = MobileClickLog(
                    clicker_id=request.POST['clicker_id']
                )
                log.save()
            except Exception as e:
                print('An exception occurred in api.post_clicks trying to POST a mobile click to the db.')
                print(str(e))
                logger.error(str(e))

            return HttpResponse( { 'status': 'OK', 'type': 'mobile' })

        else:
            print('Error with the POST request given to api.post_clicks.')
            logger.error('Error with the POST request given to api.post_clicks.')

            return HttpResponse( { 'status': 'Error parsing request.POST in api.post_clicks.' } )