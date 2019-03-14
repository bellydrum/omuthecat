from django.http import HttpResponse
from django.views.decorators.csrf import csrf_protect

from .models import ClickLog

@csrf_protect
def log_clicks(request):
    if request.method == 'POST':
        clicks = int(request.POST['clicks'])

        # store log of clicks
        log = ClickLog(number_of_clicks=clicks)
        log.save()

        return HttpResponse( { 'status': 'OK' } )