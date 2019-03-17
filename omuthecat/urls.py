from django.conf.urls import include, url
from .api import post_clicks
from .views import render_home

urlpatterns = [
    # view urls
    url('^$', render_home, name='home'),

    # api urls
    url('^post_clicks$', post_clicks, name='post_clicks'),
]
