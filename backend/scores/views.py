from rest_framework.generics import CreateAPIView
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_201_CREATED

from models.regression.linear_regression import LinearRegression
from models.regression.random_forest import RandomForest
from models.classification.logistic_regression import LogisticRegression
from scores.models import Request
from scores.models import CamRequest
from scores.serializers import RequestSerializer
from scores.serializers import CamRequestSerializer
from scores.serializers import FrameSerializer

from rest_framework.exceptions import ParseError
from rest_framework.parsers import FileUploadParser
from rest_framework.views import APIView
from scores.functions import handle_video_upload

from django.core.files.storage import FileSystemStorage
import json
import mlflow
import gs
import google.cloud
import os
import numpy as np
import pandas as pd
import re
from sklearn.preprocessing import StandardScaler

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "keys/mlflow-312506-8cfad529f4fd.json"
import tensorflow.compat.v1 as tf


class Version1(CreateAPIView):
    """
    Regression model: Linear Regression

    return: score
    """

    def create(self, request, *args, **kwargs):
        model = LinearRegression()
        score = model.predict(request.data)

        return Response({"score": score})


class Version2(CreateAPIView):
    """
    Regression model: Linear Regression
    Classification model: Logistic Regression

    return: score, weakest link
    """

    def create(self, request, *args, **kwargs):

        input_data = request.data
        if all(value == 0 for value in input_data.values()):
            return Response({'error': {
                'status': 400,
                'message': 'Input values must be larger than 0'
            }
            }, status=HTTP_400_BAD_REQUEST)

        try:
            regression_model = LinearRegression()
            score = regression_model.predict(input_data)
            classification_model = LogisticRegression()
            weakest_link = classification_model.predict(input_data)[0]
        except KeyError as error:
            return Response({'error': {
                'status': 400,
                'message': str(error)
            }
            }, status=HTTP_400_BAD_REQUEST)

        return Response({'score': score, 'weakest_link': weakest_link}, status=HTTP_200_OK)


class Version21(CreateAPIView):
    """
    Regression model: Random Forest
    Classification model: Logistic Regression

    return: score, weakest link
    """

    def create(self, request, *args, **kwargs):

        serializer_class = RequestSerializer()
        input_data = request.data
        if all(value == 0 for value in input_data.values()):
            return Response({'error': {
                'status': 400,
                'message': 'Input values must be larger than 0'
            }
            }, status=HTTP_400_BAD_REQUEST)

        try:
            regression_model = RandomForest()
            score = regression_model.predict(input_data)
            classification_model = LogisticRegression()
            weakest_link = classification_model.predict(input_data)[0]
        except ValueError:
            return Response({'error': {
                'status': 400,
                'message': 'Missing values'
            }
            }, status=HTTP_400_BAD_REQUEST)

        return Response({'score': score, 'weakest_link': weakest_link}, status=HTTP_200_OK)


class UploadFile(APIView):
    parser_class = (FileUploadParser,)

    def post(self, request, format=None):
        if 'file' not in request.data:
            raise ParseError("Missing File")

        #f = request.data['file']
        file = request.FILES['file']
        # handle_video_upload(file)

        fs = FileSystemStorage()
        if fs.exists(file.name):
            fs.delete(file.name)
        file = fs.save(file.name, file)
        fileurl = fs.url(file)

        return Response({'file': 'http://rhtrv.com:8000'+fileurl}, status=HTTP_201_CREATED)


class PoseNetFrames(ListCreateAPIView):

    # 0:None, 1:Posenet, 2:Kinect
    cut_leading_and_trailing = 1

    serializer_class = FrameSerializer
    columns_reorder_2d_in = ['head_x', 'head_y', 'left_shoulder_x', 'left_shoulder_y',
                             'left_elbow_x', 'left_elbow_y', 'right_shoulder_x', 'right_shoulder_y',
                             'right_elbow_x', 'right_elbow_y', 'left_wrist_x', 'left_wrist_y',
                             'right_wrist_x', 'right_wrist_y', 'left_hip_x', 'left_hip_y', 'right_hip_x',
                             'right_hip_y', 'left_knee_x', 'left_knee_y', 'right_knee_x', 'right_knee_y',
                             'left_ankle_x', 'left_ankle_y', 'right_ankle_x', 'right_ankle_y']

    columns_reorder_score_in = ['head_x', 'head_y', 
                            'left_shoulder_x', 'left_shoulder_y', 'right_shoulder_x', 'right_shoulder_y',
                             'left_elbow_x', 'left_elbow_y', 'right_elbow_x', 'right_elbow_y',
                             'left_wrist_x', 'left_wrist_y', 'right_wrist_x', 'right_wrist_y', 
                             'left_hip_x', 'left_hip_y', 'right_hip_x', 'right_hip_y', 
                             'left_knee_x', 'left_knee_y', 'right_knee_x', 'right_knee_y',
                             'left_ankle_x', 'left_ankle_y', 'right_ankle_x', 'right_ankle_y']

    columns_order_2d_in = ['head_x', 'head_y', 'left_shoulder_x', 'left_shoulder_y',
                           'left_elbow_x', 'left_elbow_y', 'right_shoulder_x', 'right_shoulder_y',
                           'right_elbow_x', 'right_elbow_y', 'left_hand_x', 'left_hand_y',
                           'right_hand_x', 'right_hand_y', 'left_hip_x', 'left_hip_y',
                           'right_hip_x', 'right_hip_y', 'left_knee_x', 'left_knee_y',
                           'right_knee_x', 'right_knee_y', 'left_foot_x', 'left_foot_y',
                           'right_foot_x', 'right_foot_y']

    columns_order_2d_out = ['head_x', 'head_y', 'left_shoulder_x', 'left_shoulder_y',
                            'left_elbow_x', 'left_elbow_y', 'right_shoulder_x', 'right_shoulder_y',
                            'right_elbow_x', 'right_elbow_y', 'left_hand_x', 'left_hand_y',
                            'right_hand_x', 'right_hand_y', 'left_hip_x', 'left_hip_y',
                            'right_hip_x', 'right_hip_y', 'left_knee_x', 'left_knee_y',
                            'right_knee_x', 'right_knee_y', 'left_foot_x', 'left_foot_y',
                            'right_foot_x', 'right_foot_y']

    # Posenet Scalers
    posenetInputScaler = mlflow.sklearn.load_model(
        'gs://mlflow-atlas/mlflow_artifacts/0/33d92199595745e3a005bb31f620c839/artifacts/PosenetInputScaler')
    posenetOutputScaler = mlflow.sklearn.load_model(
        'gs://mlflow-atlas/mlflow_artifacts/0/33d92199595745e3a005bb31f620c839/artifacts/PosenetOutputScaler')

    # Kinect Scaler
    kinectInputScaler = mlflow.sklearn.load_model(
        'gs://mlflow-atlas/mlflow_artifacts/0/47d7fdb1a3ed4ca48159e94ce1d6cbbc/artifacts/KinectInputScaler')
    kinectOutputScaler = mlflow.sklearn.load_model(
        'gs://mlflow-atlas/mlflow_artifacts/0/47d7fdb1a3ed4ca48159e94ce1d6cbbc/artifacts/KinectOutputScaler')

    # Models
    kinect_2D_kinect_3D_model = mlflow.keras.load_model(
        'gs://mlflow-atlas/mlflow_artifacts/0/47d7fdb1a3ed4ca48159e94ce1d6cbbc/artifacts/kinect3D')
    posenet_kinect_2D_model = mlflow.keras.load_model(
        'gs://mlflow-atlas/mlflow_artifacts/0/33d92199595745e3a005bb31f620c839/artifacts/PoseNet_to_Kinect2D')

    # cut start/stop posenet models
    cut_start_posenet_scaler = mlflow.sklearn.load_model(
        'gs://mlflow-atlas/mlflow_artifacts/0/ca84e7c5b9e54551bd4708aa457bf730/artifacts/InputScaler')
    cut_start_posenet_model = mlflow.keras.load_model(
        'gs://mlflow-atlas/mlflow_artifacts/0/ca84e7c5b9e54551bd4708aa457bf730/artifacts/cut_start_posenet')
    cut_stop_posenet_scaler = mlflow.sklearn.load_model(
        'gs://mlflow-atlas/mlflow_artifacts/0/583700c9367d4a49ad54912df95cf3cb/artifacts/InputScaler')
    cut_stop_posenet_model = mlflow.keras.load_model(
        'gs://mlflow-atlas/mlflow_artifacts/0/583700c9367d4a49ad54912df95cf3cb/artifacts/cut_stop_posenet')

    # cut start/stop kinect models
    cut_start_kinect_scaler = mlflow.sklearn.load_model(
        'gs://mlflow-atlas/mlflow_artifacts/0/14b3d62fe0ac449d98a19e883e57133c/artifacts/InputScaler')
    cut_start_kinect_model = mlflow.keras.load_model(
        'gs://mlflow-atlas/mlflow_artifacts/0/14b3d62fe0ac449d98a19e883e57133c/artifacts/cut_start_kinect')
    cut_stop_kinect_scaler = mlflow.sklearn.load_model(
        'gs://mlflow-atlas/mlflow_artifacts/0/550767846e1441389ca2c312d5b73355/artifacts/InputScaler')
    cut_stop_kinect_model = mlflow.keras.load_model(
        'gs://mlflow-atlas/mlflow_artifacts/0/550767846e1441389ca2c312d5b73355/artifacts/cut_stop_kinect')

    # Good or Bad exercise
    good_vs_bad_posenet_scaler = mlflow.sklearn.load_model(
        'gs://mlflow-atlas/mlflow_artifacts/0/4ffaf14d67db4e2f8d1d04df5fb603e4/artifacts/InputScaler')
    good_vs_bad_posenet_model = mlflow.keras.load_model(
        'gs://mlflow-atlas/mlflow_artifacts/0/4ffaf14d67db4e2f8d1d04df5fb603e4/artifacts/dense_model_posenet_good/bad')

    # Score model
    score_posenet_input_mean = 108.71090243888565
    score_posenet_output_mean = 3.1380742847822694
    score_posenet_input_std = 348.92948195050417
    score_posenet_output_std = 1.2347746037766676
    score_posenet_model = mlflow.keras.load_model(
        'gs://mlflow-atlas/mlflow_artifacts/0/472b72effd6641d49cdf48eda1bfd49e/artifacts/scoring_rnn_gru')


    def create(self, request, *args, **kwargs):
        frames = request.data["frames"]
        dataset = pd.DataFrame(frames)

        # Prepare datset
        data = pd.DataFrame(self.prepareData(dataset))
        
        # Cutting Leading and Trailing frames (Posenet)
        if self.cut_leading_and_trailing == 1:
            data = self.cut_leading_trailing_posenet(data)

        # Check Model goodness
        isGood = self.goodVsBad(data)

        # 1st Model prediction
        k2D_predictions = pd.DataFrame(self.posenetToKinect2D(data))
        k2D_predictions.columns = self.columns_order_2d_in

        # 2nd Model prediction
        k3D_predictions = self.kinect2DtoKinect3D(k2D_predictions)

        # Merge x,y and z-axis
        predictions = k3D_predictions.merge(
            k2D_predictions, left_index=True, right_index=True)

        predictions.to_csv("kinect_tset.csv")

        # Cutting Leading and Trailing frames (Kinect)
        if self.cut_leading_and_trailing == 2:
            predictions = self.cut_leading_trailing_kinect(predictions)

        # Predict score
        exerciseScore = self.predictScore(data)

        # Prepare response in the correct format
        resp = []
        for jdict in predictions.to_dict(orient='records'):
            resp.append(jdict)

        return Response({'frames': resp , 'isGood':isGood, 'score':exerciseScore}, status=HTTP_200_OK)

    def predictScore(self, data):
        HISTORY_SIZE = 150
        F = len(data)
        step = F / HISTORY_SIZE
        
        x = (data-self.score_posenet_input_mean)/self.score_posenet_input_std

        # Choose index which should be picked
        result = np.round(np.arange(0,HISTORY_SIZE-1) * step)
        result = np.append(result,F-1)
        

        X_test = np.array(data[self.columns_reorder_score_in].iloc[result]).reshape(-1,HISTORY_SIZE,26)

        prediction = self.score_posenet_model.predict(X_test,verbose=1)

        return prediction[0][0] * self.score_posenet_output_std + self.score_posenet_output_mean
    

    def goodVsBad(self,data):
        selected = np.random.uniform(0,len(data)-1,25).round().astype(int)
        selected_frames = data.iloc[selected,:]
        selected_frames = self.good_vs_bad_posenet_scaler.transform(selected_frames)

        predictions = self.good_vs_bad_posenet_model.predict(selected_frames).round().astype(int)

        return predictions.mean() > 0.7

    def cut_leading_trailing_posenet(self, data):
        trimmed_data = data.copy()
        scaled_data_start = self.cut_start_posenet_scaler.transform(data, copy=True)

        # Remove start frames
        predictions = self.cut_start_posenet_model.predict(scaled_data_start)
        predictions = predictions.round().astype(int)
        
        # Find start point based on density of true predictions
        surrounding_area = 5
        n = 0
        s = 0
        
        for pred in predictions:
            if pred == 1:
                s += 1
            else:
                if( s > surrounding_area  ):
                    break
                else:
                    s = 0
            n = n + 1
        try:
            if n < (len(data) / 2):
                trimmed_data = trimmed_data.loc[n:,:]
        except:
            print('Error trying to remove start frames')

        # Remove stop frames
        scaled_data_stop = self.cut_stop_posenet_scaler.transform(trimmed_data, copy=True)
        predictions = self.cut_stop_posenet_model.predict(scaled_data_stop)
        predictions = predictions.round().astype(int)
        predictions = np.flip(predictions)

        surrounding_area = 5
        s = 0
        n = len(data)

        for pred in predictions:
            if pred == 1:
                s += 1
            else:
                if( s > surrounding_area  ):
                    break
                else:
                    s = 0
            n -= 1
        try:
            if n > (len(data) / 2):
                trimmed_data = trimmed_data.loc[:n,:]
        except:
            print('Error trying to remove stop frames')

        return trimmed_data

    def cut_leading_trailing_kinect(self, data):
        trimmed_data = data.copy()
        scaled_data_start = self.cut_start_kinect_scaler.transform(data, copy=True)

        # Remove start frames
        predictions = self.cut_start_kinect_model.predict(scaled_data_start)
        predictions = predictions.round().astype(int)
        n = 0
        drop = []
        for pred in predictions:
            if pred == 1:
                drop.append(n)
            else:
                break
            n = n + 1
        try:
            trimmed_data.drop(index=drop, inplace=True)
        except:
            print('Error trying to remove start frames')

        print(n)
        print(predictions)
        # Remove stop frames
        scaled_data_stop = self.cut_stop_kinect_scaler.transform(trimmed_data, copy=True)
        predictions = self.cut_stop_kinect_model.predict(scaled_data_stop)
        predictions = predictions.round().astype(int)
        
        should_check = False
        drop = []
        for pred in predictions:
            if pred == 1:
                should_check = True
            if should_check:
                drop.append(n)
            n = n + 1
        print(n)
        print(predictions)
        try:
            trimmed_data.drop(index=drop, inplace=True)
        except:
            print('Error trying to remove stop frames')

        return trimmed_data

    def prepareKinect2D(self, k2D_predictions):
        # fix scales
        return self.kinectInputScaler.transform(k2D_predictions)

    def kinect2DtoKinect3D(self, frames):
        predictions = self.kinect_2D_kinect_3D_model.predict(frames)
        # fix scales
        predictions = pd.DataFrame(self.kinectOutputScaler.inverse_transform(
            predictions))
        predictions.columns = [
            'head_z', 'left_shoulder_z', 'left_elbow_z', 'right_shoulder_z',
            'right_elbow_z', 'left_hand_z', 'right_hand_z', 'left_hip_z',
            'right_hip_z', 'left_knee_z', 'right_knee_z', 'left_foot_z',
            'right_foot_z',
        ]
        return predictions

    def prepareData(self, frames):
        # remove score columns
        for c in frames.columns:
            if re.search("^.*_score$", c):
                frames.drop(columns=[c], inplace=True)

        # set head position based on nose positions
        frames['head_x'] = frames['nose_x']
        frames['head_y'] = frames['nose_y']

        # Drop extar columns
        frames.drop(columns=[
            'nose_x',
            'nose_y',
            'right_ear_x',
            'right_ear_y',
            'left_ear_x',
            'left_ear_y',
            'right_eye_x',
            'right_eye_y',
            'left_eye_x',
            'left_eye_y'
        ], inplace=True)

        # reorder columns
        frames = frames[self.columns_reorder_2d_in]

        return frames

    def posenetToKinect2D(self, frames):
        # fix scales
        frames = self.posenetInputScaler.transform(frames)

        predictions = self.posenet_kinect_2D_model.predict(frames)
        predictions = self.posenetOutputScaler.inverse_transform(predictions)
        return predictions

class Version(CreateAPIView):

    def get(self, request, *args, **kwargs):

        try:
            tf_version = tf.__version__
            #cv2_version = cv2.__version__
        except ValueError:
            return Response({'error': {
                'status': 400,
                'message': 'PostNet Error'
            }
            }, status=HTTP_400_BAD_REQUEST)

        #return Response({'tf version': tf_version,'cv2 version': cv2_version}, status=HTTP_200_OK)
        return Response({'tf version': tf_version}, status=HTTP_200_OK)

def save_request(new_data, new_score):
    """
    Function to save the request as a new row in the database table.
    """
    new_r = Request

    new_r.No_1_Angle_Deviation = new_data.get("No_1_Angle_Deviation")
    new_r.No_2_Angle_Deviation = new_data.get("No_2_Angle_Deviation")
    new_r.No_3_Angle_Deviation = new_data.get("No_3_Angle_Deviation")
    new_r.No_4_Angle_Deviation = new_data.get("No_4_Angle_Deviation")
    new_r.No_5_Angle_Deviation = new_data.get("No_5_Angle_Deviation")
    new_r.No_6_Angle_Deviation = new_data.get("No_6_Angle_Deviation")
    new_r.No_7_Angle_Deviation = new_data.get("No_7_Angle_Deviation")
    new_r.No_8_Angle_Deviation = new_data.get("No_8_Angle_Deviation")
    new_r.No_9_Angle_Deviation = new_data.get("No_9_Angle_Deviation")
    new_r.No_10_Angle_Deviation = new_data.get("No_10_Angle_Deviation")
    new_r.No_11_Angle_Deviation = new_data.get("No_11_Angle_Deviation")
    new_r.No_12_Angle_Deviation = new_data.get("No_12_Angle_Deviation")
    new_r.No_13_Angle_Deviation = new_data.get("No_13_Angle_Deviation")
    new_r.No_1_NASM_Deviation = new_data.get("No_1_NASM_Deviation")
    new_r.No_2_NASM_Deviation = new_data.get("No_2_NASM_Deviation")
    new_r.No_3_NASM_Deviation = new_data.get("No_3_NASM_Deviation")
    new_r.No_4_NASM_Deviation = new_data.get("No_4_NASM_Deviation")
    new_r.No_5_NASM_Deviation = new_data.get("No_5_NASM_Deviation")
    new_r.No_6_NASM_Deviation = new_data.get("No_6_NASM_Deviation")
    new_r.No_7_NASM_Deviation = new_data.get("No_7_NASM_Deviation")
    new_r.No_8_NASM_Deviation = new_data.get("No_8_NASM_Deviation")
    new_r.No_9_NASM_Deviation = new_data.get("No_9_NASM_Deviation")
    new_r.No_10_NASM_Deviation = new_data.get("No_10_NASM_Deviation")
    new_r.No_11_NASM_Deviation = new_data.get("No_11_NASM_Deviation")
    new_r.No_12_NASM_Deviation = new_data.get("No_12_NASM_Deviation")
    new_r.No_13_NASM_Deviation = new_data.get("No_13_NASM_Deviation")
    new_r.No_14_NASM_Deviation = new_data.get("No_14_NASM_Deviation")
    new_r.No_15_NASM_Deviation = new_data.get("No_15_NASM_Deviation")
    new_r.No_16_NASM_Deviation = new_data.get("No_16_NASM_Deviation")
    new_r.No_17_NASM_Deviation = new_data.get("No_17_NASM_Deviation")
    new_r.No_18_NASM_Deviation = new_data.get("No_18_NASM_Deviation")
    new_r.No_19_NASM_Deviation = new_data.get("No_19_NASM_Deviation")
    new_r.No_20_NASM_Deviation = new_data.get("No_20_NASM_Deviation")
    new_r.No_21_NASM_Deviation = new_data.get("No_21_NASM_Deviation")
    new_r.No_22_NASM_Deviation = new_data.get("No_22_NASM_Deviation")
    new_r.No_23_NASM_Deviation = new_data.get("No_23_NASM_Deviation")
    new_r.No_24_NASM_Deviation = new_data.get("No_24_NASM_Deviation")
    new_r.No_25_NASM_Deviation = new_data.get("No_25_NASM_Deviation")
    new_r.No_1_Time_Deviation = new_data.get("No_1_Time_Deviation")
    new_r.No_2_Time_Deviation = new_data.get("No_2_Time_Deviation")
    new_r.score = new_score
