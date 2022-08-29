from django.urls import include, re_path
from .api import post_clicks, get_guestbook_entries, submit_guestbook_entry
from .views import render_home

urlpatterns = [
    # view urls
    re_path('^$', render_home, name='home'),

    # api urls
    re_path('^post_clicks$', post_clicks, name='post_clicks'),
    re_path('^get_guestbook_entries$', get_guestbook_entries, name='get_guestbook_entries'),
    re_path('^submit_guestbook_entry$', submit_guestbook_entry, name='submit_guestbook_entry'),
]