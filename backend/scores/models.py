import uuid
from django.db import models

class Request(models.Model):
    '''
    Representing all requests to the API, including the input data and model outputs.

    Attributes:
        Id: Unique Id to identify requests.
        created_at: The date when request was created.
        score: The response of the ML algorithm: a score of how good the movement was.
    '''
    Id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient_id = models.CharField(max_length=200, default="0")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    score = models.DecimalField(max_digits=25, decimal_places=24)
    weakest_link = models.CharField(max_length=200)
    # Input data variables
    No_1_Angle_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_2_Angle_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_3_Angle_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_4_Angle_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_5_Angle_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_6_Angle_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_7_Angle_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_8_Angle_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_9_Angle_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_10_Angle_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_11_Angle_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_12_Angle_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_13_Angle_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_1_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_2_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_3_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_4_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_5_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_6_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_7_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_8_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_9_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_10_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_11_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_12_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_13_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_14_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_15_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_16_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_17_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_18_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_19_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_20_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_21_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_22_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_23_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_24_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_25_NASM_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_1_Time_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    No_2_Time_Deviation = models.DecimalField(
        max_digits=25, decimal_places=24)
    # Extra values from original dataset
    aimoscore = models.DecimalField(
        null=True, blank=True, max_digits=25, decimal_places=24)
    estimatedscore = models.DecimalField(
        null=True, blank=True, max_digits=25, decimal_places=24)


class CamRequest(models.Model):
    '''
    Representing all requests to the API, including the input data and model outputs.

    Attributes:
        Id: Unique Id to identify requests.
        created_at: The date when request was created.
        score: The response of the ML algorithm: a score of how good the movement was.
    '''
    Id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient_id = models.CharField(max_length=200, default="0")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Input data variables
    left_ankle_score = models.DecimalField(max_digits=27, decimal_places=24)
    left_ankle_x = models.DecimalField(max_digits=27, decimal_places=24)
    left_ankle_y = models.DecimalField(max_digits=27, decimal_places=24)

    left_ear_score = models.DecimalField(max_digits=27, decimal_places=24)
    left_ear_x = models.DecimalField(max_digits=27, decimal_places=24)
    left_ear_y = models.DecimalField(max_digits=27, decimal_places=24)

    left_elbow_score = models.DecimalField(max_digits=27, decimal_places=24)
    left_elbow_x = models.DecimalField(max_digits=27, decimal_places=24)
    left_elbow_y = models.DecimalField(max_digits=27, decimal_places=24)

    left_eye_score = models.DecimalField(max_digits=27, decimal_places=24)
    left_eye_x = models.DecimalField(max_digits=27, decimal_places=24)
    left_eye_y = models.DecimalField(max_digits=27, decimal_places=24)

    left_hip_score = models.DecimalField(max_digits=27, decimal_places=24)
    left_hip_x = models.DecimalField(max_digits=27, decimal_places=24)
    left_hip_y = models.DecimalField(max_digits=27, decimal_places=24)

    left_knee_score = models.DecimalField(max_digits=27, decimal_places=24)
    left_knee_x = models.DecimalField(max_digits=27, decimal_places=24)
    left_knee_y = models.DecimalField(max_digits=27, decimal_places=24)

    left_shoulder_score = models.DecimalField(max_digits=27, decimal_places=24)
    left_shoulder_x = models.DecimalField(max_digits=27, decimal_places=24)
    left_shoulder_y = models.DecimalField(max_digits=27, decimal_places=24)

    left_wrist_score = models.DecimalField(max_digits=27, decimal_places=24)
    left_wrist_x = models.DecimalField(max_digits=27, decimal_places=24)
    left_wrist_y = models.DecimalField(max_digits=27, decimal_places=24)

    nose_score = models.DecimalField(max_digits=27, decimal_places=24)
    nose_x = models.DecimalField(max_digits=27, decimal_places=24)
    nose_y = models.DecimalField(max_digits=27, decimal_places=24)

    right_ankle_score = models.DecimalField(max_digits=27, decimal_places=24)
    right_ankle_x = models.DecimalField(max_digits=27, decimal_places=24)
    right_ankle_y = models.DecimalField(max_digits=27, decimal_places=24)

    right_ear_score = models.DecimalField(max_digits=27, decimal_places=24)
    right_ear_x = models.DecimalField(max_digits=27, decimal_places=24)
    right_ear_y = models.DecimalField(max_digits=27, decimal_places=24)

    right_elbow_score = models.DecimalField(max_digits=27, decimal_places=24)
    right_elbow_x = models.DecimalField(max_digits=27, decimal_places=24)
    right_elbow_y = models.DecimalField(max_digits=27, decimal_places=24)

    right_eye_score = models.DecimalField(max_digits=27, decimal_places=24)
    right_eye_x = models.DecimalField(max_digits=27, decimal_places=24)
    right_eye_y = models.DecimalField(max_digits=27, decimal_places=24)

    right_hip_score = models.DecimalField(max_digits=227, decimal_places=24)
    right_hip_x = models.DecimalField(max_digits=27, decimal_places=24)
    right_hip_y = models.DecimalField(max_digits=27, decimal_places=24)

    right_knee_score = models.DecimalField(max_digits=27, decimal_places=24)
    right_knee_x = models.DecimalField(max_digits=27, decimal_places=24)
    right_knee_y = models.DecimalField(max_digits=27, decimal_places=24)

    right_shoulder_score = models.DecimalField(max_digits=27, decimal_places=24)
    right_shoulder_x = models.DecimalField(max_digits=27, decimal_places=24)
    right_shoulder_y = models.DecimalField(max_digits=27, decimal_places=24)

    right_wrist_score = models.DecimalField(max_digits=27, decimal_places=24)
    right_wrist_x = models.DecimalField(max_digits=27, decimal_places=24)
    right_wrist_y = models.DecimalField(max_digits=27, decimal_places=24)

class Position(models.Model):
    x = models.DecimalField(max_digits=27, decimal_places=24)
    y = models.DecimalField(max_digits=27, decimal_places=24)

class Frame(models.Model):
    score = models.DecimalField(max_digits=27, decimal_places=24)
    part = models.CharField(max_length=50)