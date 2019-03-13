from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.staticfiles.storage import staticfiles_storage
from django.conf.urls.static import static
from django.views.generic.base import RedirectView
from .views import *

urlpatterns = [
    # navigational page rendering
    url('^$', render_home, name='home'),
]