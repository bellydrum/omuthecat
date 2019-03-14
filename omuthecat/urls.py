from django.conf.urls import include, url
from .views import *

urlpatterns = [
    # navigational page rendering
    url('^$', render_home, name='home'),

    # api urls
    url('^log_clicks$', log_clicks, name='log_clicks'),
]
