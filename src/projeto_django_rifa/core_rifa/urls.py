from django.urls import path
from .views import ComprarBilheteView, sortear_rifa

urlpatterns = [
    path('comprar/', ComprarBilheteView.as_view(), name='comprar_bilhete'),
    path('sortear/<int:rifa_id>/', sortear_rifa, name='sortear_rifa'),
]
