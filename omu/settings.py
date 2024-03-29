"""
Django settings for omu project.

Generated by 'django-admin startproject' using Django 2.1.7.

For more information on this file, see
https://docs.djangoproject.com/en/2.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.1/ref/settings/
"""

import mimetypes
import os


mimetypes.add_type("text/css", ".css", True)

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!

SECRET_KEY = 'zzxkcc&udj83ztpd5#!&z&uaq)45mgr3bz*yenpvs5(r1zl!2%'

# SECURITY WARNING: don't run with debug turned on in production!

# debug is an environment variable set by debug.py
"""
if 'DEBUG' in os.environ.values():
    DEBUG = os.environ['DEBUG'].lower() == 'true'
    print('DEBUG is {}'.format(DEBUG))
else:
    DEBUG = True

print(f'DEBUG is {DEBUG}')
"""
DEBUG = False


# make AWS stop bitching at me
AWS_DEFAULT_ACL = None


ALLOWED_HOSTS = [
    '*',
    #'omuthecat.com',
    #'www.omuthecat.com'
] if not DEBUG else ['*']


# Application definition

INSTALLED_APPS = [
    'whitenoise.runserver_nostatic',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'omuthecat',
    'pipeline',
    'storages'
]

MIDDLEWARE = [
    'django.middleware.common.CommonMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'omu.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'omu.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.1/ref/settings/#databases

if DEBUG:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'omuthecat',
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'omuthecat',
        }
    }


# Password validation
# https://docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.1/howto/static-files/


STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'pipeline.finders.PipelineFinder',
)

# staticfiles configuration

STATICFILES_LOCATION = 'static/'
STATICFILES_STORAGE = 'pipeline.storage.PipelineStorage'
STATIC_ROOT = 'static/'
STATIC_URL = 'static/'

"""
if DEBUG:
    STATICFILES_LOCATION = 'static/'
    STATICFILES_STORAGE = 'pipeline.storage.PipelineStorage'
else:
    STATICFILES_LOCATION = 'static'
    STATICFILES_STORAGE = 'custom_storages.StaticStorage'
    MEDIAFILES_LOCATION = 'media'
    DEFAULT_FILE_STORAGE = 'custom_storages.MediaStorage'

AWS_USER = os.environ.get('S3_USER')
AWS_ACCESS_KEY_ID = os.environ.get('S3_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('S3_SECRET_ACCESS_KEY')
AWS_BUCKET_NAME = 'omuassetsd4d3db84-93ec-4c32-99d3-4fd9a318c2aa'
AWS_STORAGE_BUCKET_NAME = 'omuassetsd4d3db84-93ec-4c32-99d3-4fd9a318c2aa'
AWS_S3_CUSTOM_DOMAIN = '{}.s3.amazonaws.com'.format(AWS_BUCKET_NAME)
AWS_LOCATION = 'static'
if DEBUG:
    STATIC_URL = 'static/'
    STATIC_ROOT = os.path.join(BASE_DIR, 'static')
else:
    STATIC_URL = 'https://{}/{}/'.format( AWS_S3_CUSTOM_DOMAIN, AWS_LOCATION )
    STATICFILES_DIRS = [ os.path.join(BASE_DIR, 'static'), ]
AWS_S3_OBJECT_PARAMETERS = { 'CacheControl': 'max-age=86400', }
AWS_IS_GZIPPED = True
"""

# django-pipeline configuration

PIPELINE = {
    'PIPELINE_ENABLED': True,
    'CSS_COMPRESSOR': 'pipeline.compressors.NoopCompressor',
    'JS_COMPRESSOR': 'pipeline.compressors.NoopCompressor',
    'COMPILERS': ('pipeline.compilers.es6.ES6Compiler',),
    'BABEL_BINARY': os.path.join(BASE_DIR, 'node_modules/.bin/babel'),
    'STYLESHEETS': {
        'styles': {
            'source_filenames': (
                'css/main.css',
            ),
            'output_filename': 'css/main.css',
        },
    },
    'JAVASCRIPT': {
        'crypto-js': {
            'source_filenames': (
                'js/lib/crypto-js/crypto-js.es6',
            ),
            'output_filename': 'js/crypto-js.js'
        },
        'scripts': {
            'source_filenames': (
                'js/src/*.es6',
                'js/src/app.es6',
            ),
            'output_filename': 'js/app.js',
        },
    },
}


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'class': 'logging.FileHandler',
            'level': 'DEBUG',
            'filename': 'logs/debug.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
