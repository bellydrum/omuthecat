from django.conf.urls import include, url
from .api import log_clicks
from .views import render_home

urlpatterns = [
    # view urls
    url('^$', render_home, name='home'),

    # api urls
    url('^log_clicks$', log_clicks, name='log_clicks'),
]
