from rest_framework import serializers
from .models import Rifa, Bilhete

class RifaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rifa
        fields = '__all__'

class BilheteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bilhete
        fields = '__all__'
        read_only_fields = ('comprado_em',)

class ComprarBilheteSerializer(serializers.Serializer):
    rifa_id = serializers.IntegerField()
    numero = serializers.IntegerField()
    comprador_nome = serializers.CharField(max_length=100)
