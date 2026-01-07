from django.urls import path
from .views import ComprarBilheteView, sortear_rifa, reset_rifa, update_config

urlpatterns = [
    path('comprar/', ComprarBilheteView.as_view(), name='comprar_bilhete'),
    path('sortear/<int:rifa_id>/', sortear_rifa, name='sortear_rifa'),
    
    # NOVAS ROTAS (Admin)
    path('reset-board/', reset_rifa, name='reset_rifa'),
    path('update-config/', update_config, name='update_config'),
]
