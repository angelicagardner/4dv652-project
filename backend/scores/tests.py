from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.test import APIClient


class APIResponseTest(APITestCase):
    """
    Test response status codes and data output from API.
    """

    def setUp(self):
        self.client = APIClient()
        self.url = '/api/v2/scores'
        self.valid_input_data = get_valid_payload()
        self.invalid_input_data = get_invalid_payload()

    def test_valid_request(self):
        response = self.client.post(
            self.url, self.valid_input_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['score'] >=
                        0.0 and response.data['score'] <= 1.0)
        self.assertTrue(response.data['weakest_link']
                        in get_weakest_link_alternatives())

    def test_invalid_request(self):
        response = self.client.post(
            self.url, self.invalid_input_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


def get_valid_payload():
    """
    Retrieve valid input data
    """
    return {
        "No_1_Angle_Deviation": 0.538020086083214,
        "No_2_Angle_Deviation": 0.815877570540411,
        "No_3_Angle_Deviation": 0.346724055475849,
        "No_4_Angle_Deviation": 0.382113821138211,
        "No_5_Angle_Deviation": 0.302247728359637,
        "No_6_Angle_Deviation": 0.947871831659493,
        "No_7_Angle_Deviation": 0.275944524151124,
        "No_8_Angle_Deviation": 0.521759923481588,
        "No_9_Angle_Deviation": 0.457197513151602,
        "No_10_Angle_Deviation": 0.210425633668101,
        "No_11_Angle_Deviation": 0.835007173601148,
        "No_12_Angle_Deviation": 0.4519368723099,
        "No_13_Angle_Deviation": 0.178861788617886,
        "No_1_NASM_Deviation": 0.302247728359637,
        "No_2_NASM_Deviation": 0.275944524151124,
        "No_3_NASM_Deviation": 0.538020086083214,
        "No_4_NASM_Deviation": 0.210425633668101,
        "No_5_NASM_Deviation": 0.178861788617886,
        "No_6_NASM_Deviation": 0.778574844571975,
        "No_7_NASM_Deviation": 0.214729794356767,
        "No_8_NASM_Deviation": 0.428503108560497,
        "No_9_NASM_Deviation": 0.300813008130081,
        "No_10_NASM_Deviation": 0.432329029172645,
        "No_11_NASM_Deviation": 0.730750836920134,
        "No_12_NASM_Deviation": 0.606408417025347,
        "No_13_NASM_Deviation": 0.829746532759445,
        "No_14_NASM_Deviation": 0.838833094213295,
        "No_15_NASM_Deviation": 0.459110473457676,
        "No_16_NASM_Deviation": 0.652797704447633,
        "No_17_NASM_Deviation": 0.711142993782879,
        "No_18_NASM_Deviation": 0.587757054041129,
        "No_19_NASM_Deviation": 0.833094213295074,
        "No_20_NASM_Deviation": 0.65662362505978,
        "No_21_NASM_Deviation": 0.642276422764228,
        "No_22_NASM_Deviation": 0.552845528455285,
        "No_23_NASM_Deviation": 0.648971783835485,
        "No_24_NASM_Deviation": 0.57819225251076,
        "No_25_NASM_Deviation": 0.560019129603061,
        "No_1_Time_Deviation": 0.821616451458632,
        "No_2_Time_Deviation": 0.818747010999522
    }


def get_invalid_payload():
    """
    Retrieve invalid input data
    """
    return {
        "No_1_Angle_Deviation": 0.538020086083214,
        "No_2_Angle_Deviation": 815877570540411,
        "No_3_Angle_Deviation": 0.346724055475849,
        "No_4_Angle_Deviation": 0.382113821138211,
        "No_5_Angle_Deviation": 0.302247728359637,
        "No_6_Angle_Deviation": 0.947871831659493,
        "No_7_Angle_Deviation": 0.275944524151124,
        "No_8_Angle_Deviation": 0.521759923481588,
        "No_9_Angle_Deviation": 0.457197513151602,
        "No_10_Angle_Deviation": 0.210425633668101,
        "No_11_Angle_Deviation": 0.835007173601148,
        "No_12_Angle_Deviation": 0.4519368723099,
        "No_13_Angle_Deviation": 0.178861788617886,
        "No_2_NASM_Deviation": 0.275944524151124,
        "No_3_NASM_Deviation": 0.538020086083214,
        "No_4_NASM_Deviation": 0.210425633668101,
        "No_5_NASM_Deviation": 0.178861788617886,
        "No_6_NASM_Deviation": 0.778574844571975,
        "No_7_NASM_Deviation": 0.214729794356767,
        "No_8_NASM_Deviation": 0.428503108560497,
        "No_9_NASM_Deviation": 0.300813008130081,
        "No_10_NASM_Deviation": 0.432329029172645,
        "No_11_NASM_Deviation": 0.730750836920134,
        "No_12_NASM_Deviation": 0.606408417025347,
        "No_13_NASM_Deviation": 0.829746532759445,
        "No_14_NASM_Deviation": 0.838833094213295,
        "No_15_NASM_Deviation": 0.459110473457676,
        "No_16_NASM_Deviation": 0.652797704447633,
        "No_17_NASM_Deviation": 0.711142993782879,
        "No_18_NASM_Deviation": 0.587757054041129,
        "No_19_NASM_Deviation": 0.833094213295074,
        "No_20_NASM_Deviation": 0.65662362505978,
        "No_21_NASM_Deviation": 0.642276422764228,
        "No_22_NASM_Deviation": 0.552845528455285,
        "No_23_NASM_Deviation": 0.648971783835485,
        "No_24_NASM_Deviation": 0.57819225251076,
        "No_25_NASM_Deviation": 0.560019129603061,
        "No_1_Time_Deviation": 0.821616451458632,
        "No_2_Time_Deviation": 0.818747010999522
    }


def get_weakest_link_alternatives():
    return ['ForwardHead', 'LeftArmFallForward', 'RightArmFallForward', 'LeftShoulderElevation',
            'RightShoulderElevation', 'ExcessiveForwardLean', 'LeftAsymmetricalWeightShift',
            'RightAsymmetricalWeightShift', 'LeftKneeMovesInward', 'RightKneeMovesInward',
            'LeftKneeMovesOutward', 'RightKneeMovesOutward', 'LeftHeelRises', 'RightHeelRises']
