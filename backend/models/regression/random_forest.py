import os
import joblib
import pandas as pd


class RandomForest:
    def __init__(self):
        dir_path = os.path.dirname(os.path.realpath(__file__))
        self.model = joblib.load(dir_path + "/random_forest.joblib")

    def preprocessing(self, input_data):
        # JSON to pandas DataFrame
        input_data = pd.DataFrame(input_data, index=[0])

        result = input_data.drop(
            columns=[
                "No_1_Angle_Deviation",
                "No_5_Angle_Deviation",
                "No_7_Angle_Deviation",
                "No_10_Angle_Deviation",
                "No_13_Angle_Deviation",
                "No_1_NASM_Deviation",
                "No_5_NASM_Deviation",
                "No_9_NASM_Deviation",
                "No_11_NASM_Deviation",
                "No_2_Time_Deviation"
            ]
        )

        return result

    def predict(self, input_data):
        score = self.model.predict(self.preprocessing(input_data))

        return score
