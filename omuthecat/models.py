from django.db import models
from django.utils import timezone

# click storage table for desktop clickers
class DesktopClickLog(models.Model):
    clicker_id = models.CharField(
        max_length=512,
        blank=False,
        null=False,
        default='null'
    )
    clicks = models.PositiveSmallIntegerField(
        blank=False,
        null=False,
        default=0
    )
    datetime_logged = models.DateTimeField(
        editable=False
    )
    # custom save() method in lieu of .auto_now()
    # https://stackoverflow.com/a/1737078
    def save(self, *args, **kwargs):
        if not self.id:
            self.datetime_logged = timezone.localtime(timezone.now())
        return super(DesktopClickLog, self).save(*args, **kwargs)

    class Meta:
        db_table = 'desktop_clicks'


# click storate table for mobile clickers
class MobileClickLog(models.Model):
    clicker_id = models.CharField(
        max_length=512,
        blank=False,
        null=False
    )
    datetime_logged = models.DateTimeField(
        editable=False
    )
    # custom save() method in lieu of .auto_now()
    # https://stackoverflow.com/a/1737078
    def save(self, *args, **kwargs):
        if not self.id:
            self.datetime_logged = timezone.localtime(timezone.now())
        return super(MobileClickLog, self).save(*args, **kwargs)

    class Meta:
        db_table = 'mobile_clicks'

# entry from a user to the guestbook
class GuestbookEntry(models.Model):
    username = models.CharField(
        max_length=128,
        blank=True,
        null=True,
        default="null"
    )
    message = models.TextField(
        max_length=512,
        blank=False,
        null=False
    )
    clicker_id = models.CharField(
        max_length=512,
        blank=False,
        null=False
    )
    clicks = models.PositiveSmallIntegerField(
        blank=False,
        null=False,
        default=0
    )
    datetime_logged = models.DateTimeField(
        editable=False
    )
    # custom save() method in lieu of .auto_now()
    # https://stackoverflow.com/a/1737078
    def save(self, *args, **kwargs):
        if not self.id:
            self.datetime_logged = timezone.localtime(timezone.now())
        return super(GuestbookEntry, self).save(*args, **kwargs)

    class Meta:
        db_table = 'guestbook'
