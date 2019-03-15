from django.db.models import Count
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_protect

from .models import DesktopClickLog, MobileClickLog

from collections import Counter
from operator import itemgetter

from pprint import pprint


################## called by views.py

@csrf_protect
def get_high_score(request):
    ''' returns { clicker_id : total_clicks } '''

    if request.method == 'GET':

        high_score = { 'clicker_id' : 69 }


        # desktop_scores = {}
        #     { 'clicker_id': i.clicker_id, 'clicks': i.clicks }
        #     for i in DesktopClickLog.objects.annotate(score=Count('clicks'))
        # ]
        # mobile_scores = [
        #     {'clicker_id': i[0], 'clicks': i[1] }
        #     for i in Counter([i['clicker_id'] for i in MobileClickLog.objects.values('clicker_id')]).items()
        # ]
        # print(desktop_scores)
        # print(mobile_scores)
        #
        # highest_desktop_score = max(
        #     [ value['clicks'] for value in desktop_scores ]
        # ) if desktop_scores else 0
        #
        # highest_mobile_score = max(
        #     [ value['clicks'] for value in mobile_scores ]
        # ) if mobile_scores else 0
        #
        # highest_total_score = max(
        #     [ value['clicks'] for value in desktop_scores + mobile_scores ]
        # ) if len(desktop_scores + mobile_scores) else 0
        #
        # maximum = {
        #     max(desktop_scores, key=desktop_scores.get): desktop_scores[max(desktop_scores, key=desktop_scores.get)]
        # }
        #
        # print('Highest desktop score: {}'.format(maximum))
        # print('Highest mobile score: {}'.format(highest_mobile_score))
        #
        #
        #
        # print(highest_total_score)

        # totals = ClickLog.objects.values('clicker_id').annotate(clicks=Count('clicker_id'))
        # return { i['clicker_id'] : i['clicks'] for i in totals if i['clicks'] == max( [j['clicks'] for j in totals ]) }





        return high_score



################## called by urls.py

@csrf_protect
def log_clicks(request):
    if request.method == 'POST':

        # log desktop clicks
        if 'clicker_id' in request.POST.keys() and 'clicks' in request.POST.keys():

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