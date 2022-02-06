import os
import joblib
import pandas as pd


class LogisticRegression:
    def __init__(self):
        dir_path = os.path.dirname(os.path.realpath(__file__))
        self.model = joblib.load(dir_path + "/logistic_regression.joblib")

    def preprocessing(self, input_data):
        # JSON to pandas DataFrame
        input_data = pd.DataFrame(input_data, index=[0])

        return input_data

    def predict(self, input_data):
        x = self.preprocessing(input_data)
        return self.model.predict(x)
