from django.urls import re_path
from scores.views import Version1, Version2, Version21, UploadFile, PoseNetFrames, Version
app_name = 'scores'
urlpatterns = [
    re_path(r'v1/scores/?$', Version1.as_view()),
    re_path(r'v2/scores/?$', Version21.as_view()),
    re_path(r'v2/scores/?$', Version2.as_view()),
    re_path(r'v3/videoupload/?$', UploadFile.as_view()),
    re_path(r'v3/camupload/?$', PoseNetFrames.as_view()),
    re_path(r'v3/ver/?$', Version.as_view())
]
