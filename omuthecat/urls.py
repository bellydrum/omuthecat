from django.conf.urls import include, url
from .views import *

urlpatterns = [
    # navigational page rendering
    url('^$', render_home, name='home'),

    # api urls
    url('^change_picture$', change_picture, name='change_picture'),
    url('^log_clicks$', log_clicks, name='log_clicks'),
]