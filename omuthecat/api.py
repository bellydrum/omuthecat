from django.db.models import Count
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_protect

from collections import Counter

from .models import DesktopClickLog, MobileClickLog


################## called by views.py

@csrf_protect
def get_all_entries(request):
    """ returns dictionary { 'clicker_id' : 'clicks' } of all unique click_ids in DesktopClickLog and MobileClickLog """

    # gather scores in { clicker_id : clicks } format
    desktop_entries = [
        { 'clicker_id': i.clicker_id, 'clicks': i.clicks }
        for i in DesktopClickLog.objects.annotate(score=Count('clicks'))
    ]
    mobile_entries = [
        {'clicker_id': i[0], 'clicks': i[1] }
        for i in Counter([i['clicker_id'] for i in MobileClickLog.objects.values('clicker_id')]).items()
    ]

    # put all entries into a single dictionary
    all_entries = {
        entry['clicker_id'] : entry['clicks']
        for entry in [ i for i in ( desktop_entries + mobile_entries ) ]
    }

    return all_entries


################## called by urls.py

@csrf_protect
def log_clicks(request):
    if request.method == 'POST':

        # log desktop clicks
        if 'clicker_id' in request.POST.keys() and 'clicks' in request.POST.keys():

            print('desktop\n')
            print((i, j) for i, j in request.POST.items())

            log = DesktopClickLog(
                clicker_id=request.POST['clicker_id'],
                clicks=request.POST['clicks']
            )
            log.save()

            return HttpResponse( { 'status': 'OK', 'type': 'desktop' } )

        # log mobile clicks
        elif 'clicker_id' in request.POST.keys() and 'clicks' not in request.POST.keys():

            log = MobileClickLog(
                clicker_id=request.POST['clicker_id']
            )
            log.save()

            return HttpResponse( { 'status': 'OK', 'type': 'mobile' })

        else:
            print('\nERROR: Error with request.POST in api.log_clicks.\n')
            return HttpResponse( { 'status': 'Error parsing request.POST in api.log_clicks.' } )