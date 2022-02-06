from rest_framework import serializers
from scores.models import Request
from scores.models import CamRequest
from scores.models import Frame
from scores.models import Position
class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = '__all__'

class CamRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CamRequest
        fields = '__all__'

class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = '__all__'

class FrameSerializer(serializers.ModelSerializer):
    position = PositionSerializer()
    class Meta:
        model = Frame
        fields = '__all__'

