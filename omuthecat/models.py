from django.db import models
from django.utils import timezone

# Create your models here.
class ClickLog(models.Model):
    number_of_clicks = models.PositiveSmallIntegerField(
        blank=False,
        null=False
    )
    datetime_logged = models.DateTimeField(
        editable=False
    )
    # custom save() method in lieu of .auto_now()
    # https://stackoverflow.com/a/1737078
    def save(self, *args, **kwargs):
        ''' on save, add timestamp '''
        if not self.id:
            self.datetime_logged = timezone.localtime(timezone.now())
        return super(ClickLog, self).save(*args, **kwargs)

    class Meta:
        db_table = 'click_log'