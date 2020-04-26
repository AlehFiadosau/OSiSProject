from django.urls import path
from startup import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    path("", views.home, name="home"),
    path("surface/", views.surface, name="surface"),
    path("calculation/", views.calculation, name="calculation"),
    path("analysis/", views.analysis, name="analysis"),
    path("calcAnalysis/", views.calcAnalysis, name="calcAnalysis"),
    path("calcSquare/", views.calcSquare, name="calcSquare"),
    path("getFile/", views.getFile, name="getFile"),
    path("getDataForSurface/", views.getDataForSurface, name="getDataForSurface"),
    path("fullScreenCard/", views.fullScreenCard, name="fullScreenCard"),
]

urlpatterns += staticfiles_urlpatterns()