from django.db.models import Count
from django.http import HttpResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_protect

from collections import Counter
from json import dumps, loads
import logging

from .models import DesktopClickLog, GuestbookEntry, MobileClickLog


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

        data = loads(request.body)

        # log desktop clicks
        if 'clicker_id' in data.keys() and 'clicks' in data.keys():

            # get or create user
            try:
                existing_user = DesktopClickLog.objects.get(clicker_id=data['clicker_id'])
            except DesktopClickLog.DoesNotExist:
                existing_user = None
            except Exception as e:
                print('An exception occurred in api.post_clicks trying to get or create existing_user.')
                print(str(e))
                logger.error(str(e))

            # if the clicker_id already exists in DesktopMobileLog
            try:
                if existing_user is not None:
                    existing_user.clicks += int(data['clicks'])
                else:
                    existing_user = DesktopClickLog(
                        clicker_id=data['clicker_id'],
                        clicks=data['clicks']
                    )
                existing_user.save()

            except Exception as e:
                print('An exception occurred in api.post_clicks trying to increment existing_user clicks in db.')
                print(str(e))
                logger.error(str(e))

            # IMPORTANT -- make sure the given value of dumps() is JSON
            return HttpResponse( dumps( [{ 'status': 'OK', 'type': 'desktop' }] ) )

        # log mobile clicks
        elif 'clicker_id' in data.keys() and 'clicks' not in data.keys():

            try:
                log = MobileClickLog(
                    clicker_id=data['clicker_id']
                )
                log.save()
            except Exception as e:
                print('An exception occurred in api.post_clicks trying to POST a mobile click to the db.')
                print(str(e))
                logger.error(str(e))

            # IMPORTANT -- make sure the given value of dumps() is JSON
            return HttpResponse( dumps( [{ 'status': 'OK', 'type': 'mobile' }] ) )

        else:
            print('Error with the POST request given to api.post_clicks.')
            logger.error('Error with the POST request given to api.post_clicks.')

            # IMPORTANT -- make sure the given value of dumps() is JSON
            return HttpResponse( dumps( [{ 'status': 'Error parsing request.POST in api.post_clicks.' }] ) )

@csrf_protect
def submit_guestbook_entry(request):

    if request.method == 'POST':

        username = request.POST['username']
        message = request.POST['message']
        clicker_id = request.COOKIES['clickerid']
        clicks = request.COOKIES['currentUserTotalClicks']

        # TODO - send message back to /home/ if no username/message supplied

        if username and message:
            guestbook_log = GuestbookEntry(
                username=username,
                message=message,
                clicker_id = clicker_id,
                clicks = clicks
            )
            guestbook_log.save()
        else:
            print('Error: No message included in GuestbookEntry.')

        return redirect('home')