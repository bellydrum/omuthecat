from django.conf.urls import include, url
from .api import post_clicks, get_guestbook_entries, submit_guestbook_entry
from .views import render_home

urlpatterns = [
    # view urls
    url('^$', render_home, name='home'),

    # api urls
    url('^post_clicks$', post_clicks, name='post_clicks'),
    url('^get_guestbook_entries$', get_guestbook_entries, name='get_guestbook_entries'),
    url('^submit_guestbook_entry$', submit_guestbook_entry, name='submit_guestbook_entry'),
]