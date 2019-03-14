from django.http import HttpResponse
from django.views.decorators.csrf import csrf_protect

from .models import ClickLog


################## called by views.py

@csrf_protect
def get_high_score(request):
    if request.method == 'GET':
        return max( [ int(log.number_of_clicks) for log in ClickLog.objects.all() ] )



################## called by urls.py

@csrf_protect
def log_clicks(request):
    if request.method == 'POST':
        log = ClickLog(number_of_clicks=int(request.POST['clicks']))
        log.save()
        return HttpResponse( { 'status': 'OK' } )