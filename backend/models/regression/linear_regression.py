import os
import joblib
import numpy as np
import pandas as pd
import statsmodels.api as sm
import scipy.stats as stats


class LinearRegression:
    def __init__(self):
        dir_path = os.path.dirname(os.path.realpath(__file__))
        self.model = joblib.load(dir_path + "/linear_regression.joblib")

    def preprocessing(self, input_data):
        # JSON to pandas DataFrame
        input_data = pd.DataFrame(input_data, index=[0])

        # Remove Duplicates
        input_data = input_data.drop(
            columns=[
                "No_1_Angle_Deviation",
                "No_5_Angle_Deviation",
                "No_7_Angle_Deviation",
                "No_10_Angle_Deviation",
                "No_13_Angle_Deviation"
            ]
        )

        # Remove Outliers
        data = input_data
        z = np.abs(stats.zscore(data))
        fData = data[(z < 2.75).all(axis=1)]

        # Add interactions
        input_data["A4*N11"] = input_data["No_4_Angle_Deviation"] * \
            input_data["No_11_NASM_Deviation"]
        input_data["A8*N12"] = input_data["No_8_Angle_Deviation"] * \
            input_data["No_12_NASM_Deviation"]
        input_data["N2*N20"] = input_data["No_2_NASM_Deviation"] * \
            input_data["No_20_NASM_Deviation"]
        input_data["N12*N13"] = input_data["No_12_NASM_Deviation"] * \
            input_data["No_13_NASM_Deviation"]
        input_data["N12*N15"] = input_data["No_12_NASM_Deviation"] * \
            input_data["No_15_NASM_Deviation"]

        input_data["N12*N16"] = input_data["No_12_NASM_Deviation"] * \
            input_data["No_16_NASM_Deviation"]
        input_data["N12*N20"] = input_data["No_12_NASM_Deviation"] * \
            input_data["No_20_NASM_Deviation"]
        input_data["N12*N20*N22"] = input_data["No_12_NASM_Deviation"] * \
            input_data["No_20_NASM_Deviation"] * \
            input_data["No_22_NASM_Deviation"]
        input_data["N12*N20*N19"] = input_data["No_12_NASM_Deviation"] * \
            input_data["No_20_NASM_Deviation"] * \
            input_data["No_19_NASM_Deviation"]
        input_data["N12*N20*N19*N16"] = input_data["No_12_NASM_Deviation"] * input_data["No_20_NASM_Deviation"] * \
            input_data["No_19_NASM_Deviation"] * \
            input_data["No_16_NASM_Deviation"]

        input_data["N12*N23"] = input_data["No_12_NASM_Deviation"] * \
            input_data["No_23_NASM_Deviation"]

        input_data["N21*N24"] = input_data["No_21_NASM_Deviation"] * \
            input_data["No_24_NASM_Deviation"]
        input_data["T1*N2"] = input_data["No_1_Time_Deviation"] * \
            input_data["No_2_Time_Deviation"]

        input_data["T1*N2"] = input_data["No_1_Time_Deviation"] * \
            input_data["No_2_NASM_Deviation"]
        input_data["T1*N13"] = input_data["No_1_Time_Deviation"] * \
            input_data["No_13_NASM_Deviation"]
        input_data["T1*N2"] = input_data["No_1_Time_Deviation"] * \
            input_data["No_2_Angle_Deviation"]
        input_data["T1*N5"] = input_data["No_1_Time_Deviation"] * \
            input_data["No_5_NASM_Deviation"]
        input_data["T1*N18"] = input_data["No_1_Time_Deviation"] * \
            input_data["No_18_NASM_Deviation"]
        input_data["N5*N10*N12"] = input_data["No_5_NASM_Deviation"] * \
            input_data["No_10_NASM_Deviation"] * \
            input_data["No_12_NASM_Deviation"]
        input_data["N8*N12"] = input_data["No_8_Angle_Deviation"] * \
            input_data["No_12_NASM_Deviation"]
        input_data["N5*N10*N12*N15"] = input_data["No_5_NASM_Deviation"] * input_data["No_10_NASM_Deviation"] * \
            input_data["No_12_NASM_Deviation"] * \
            input_data["No_15_NASM_Deviation"]

        input_data["A11*N12"] = input_data["No_11_Angle_Deviation"] * \
            input_data["No_12_NASM_Deviation"]
        input_data["N10*N11*N12"] = input_data["No_10_NASM_Deviation"] * \
            input_data["No_11_NASM_Deviation"] * \
            input_data["No_12_NASM_Deviation"]
        input_data["N8*N11"] = input_data["No_8_NASM_Deviation"] * \
            input_data["No_11_NASM_Deviation"]
        input_data["N8*N15"] = input_data["No_8_NASM_Deviation"] * \
            input_data["No_15_NASM_Deviation"]
        input_data["N15*N20"] = input_data["No_15_NASM_Deviation"] * \
            input_data["No_20_NASM_Deviation"]
        input_data["N14*N15*N20*N21"] = input_data["No_14_NASM_Deviation"] * input_data["No_15_NASM_Deviation"] * \
            input_data["No_20_NASM_Deviation"] * \
            input_data["No_21_NASM_Deviation"]

        input_data["N5*N10"] = input_data["No_5_NASM_Deviation"] * \
            input_data["No_10_NASM_Deviation"]

        input_data["N5**2"] = input_data["No_5_NASM_Deviation"] ** 2
        input_data["N8**2"] = input_data["No_8_NASM_Deviation"] ** 2

        input_data["N10**2"] = input_data["No_10_NASM_Deviation"] ** 2

        input_data["N11**2"] = input_data["No_11_NASM_Deviation"] ** 2

        input_data["N10**3"] = input_data["No_10_NASM_Deviation"] ** 3
        input_data["N8**"] = input_data["No_8_NASM_Deviation"] ** 3

        input_data["N11**3"] = input_data["No_11_NASM_Deviation"] ** 3

        input_data["N8**4"] = input_data["No_8_NASM_Deviation"] ** 4

        input_data["N8**5"] = input_data["No_8_NASM_Deviation"] ** 5

        input_data["N10*N11"] = input_data["No_10_NASM_Deviation"] * \
            input_data["No_11_NASM_Deviation"]
        input_data["N5*N14"] = input_data["No_5_NASM_Deviation"] * \
            input_data["No_14_NASM_Deviation"]
        input_data["N20*N24"] = input_data["No_20_NASM_Deviation"] * \
            input_data["No_24_NASM_Deviation"]
        input_data["N21*N23"] = input_data["No_21_NASM_Deviation"] * \
            input_data["No_23_NASM_Deviation"]
        input_data["T1*N21*N23"] = input_data["No_1_Time_Deviation"] * \
            input_data["N21*N23"]
        input_data["T1*N21*N23*N12"] = input_data["No_1_Time_Deviation"] * \
            input_data["N21*N23"] * input_data["No_12_NASM_Deviation"]

        input_data["T1*N21*N23*N2*N5"] = input_data["No_1_Time_Deviation"] * \
            input_data["N21*N23"]*input_data["No_2_NASM_Deviation"] * \
            input_data["No_5_NASM_Deviation"]
        input_data["N20*N16"] = input_data["No_20_NASM_Deviation"] * \
            input_data["No_16_NASM_Deviation"]
        input_data["N20*N16*N19"] = input_data["No_20_NASM_Deviation"] * \
            input_data["No_16_NASM_Deviation"] * \
            input_data["No_19_NASM_Deviation"]

        input_data["N1*N2*N4*N5"] = input_data["No_1_NASM_Deviation"] * input_data["No_2_NASM_Deviation"] * \
            input_data["No_4_NASM_Deviation"] * \
            input_data["No_5_NASM_Deviation"]
        input_data["N12*N6"] = input_data["No_12_NASM_Deviation"] * \
            input_data["No_6_NASM_Deviation"]
        input_data["N12*N7"] = input_data["No_12_NASM_Deviation"] * \
            input_data["No_7_NASM_Deviation"]
        input_data["N12**2"] = input_data["No_12_NASM_Deviation"] ** 2
        input_data["N12**3"] = input_data["No_12_NASM_Deviation"] ** 3
        input_data["N12**4"] = input_data["No_12_NASM_Deviation"] ** 4
        input_data["N12**5"] = input_data["No_12_NASM_Deviation"] ** 5
        input_data["N12**6"] = input_data["No_12_NASM_Deviation"] ** 6

        input_data["N15**3"] = input_data["No_15_NASM_Deviation"] ** 3
        input_data["N20**3"] = input_data["No_20_NASM_Deviation"] ** 3

        final = input_data.drop(columns=[
            "No_4_Angle_Deviation",
            "No_14_NASM_Deviation",
            "No_4_NASM_Deviation",
            "No_5_NASM_Deviation",
            "No_21_NASM_Deviation",
            "No_24_NASM_Deviation",
            "No_25_NASM_Deviation",
            "No_10_NASM_Deviation",
            "No_11_NASM_Deviation",
            "No_13_NASM_Deviation",
            "No_2_Time_Deviation"
        ])

        t = sm.add_constant(final, prepend=False)

        return t

    def predict(self, input_data):
        x = self.preprocessing(input_data)
        score = self.model.predict(x)[0]
        if score < 0:
            return 0.0
        elif score > 1:
            return 1.0
        return score
