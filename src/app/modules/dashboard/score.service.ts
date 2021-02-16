import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'

@Injectable({
    providedIn: 'root'
})
export class ScoreService {

    constructor(private http: HttpClient){}

    predictScore(pridictors:AimoPredictors) {
        console.log(pridictors);
        return this.http.post<ScoreResponse>('http://46.101.216.188/api/v1/scores',pridictors)
            .pipe(map(response => { 
                return response.score;
            }));
        
    }
}

interface ScoreResponse {
    score: number
}

interface AimoPredictors {
    No_1_Angle_Deviation: number, No_2_Angle_Deviation: number, No_3_Angle_Deviation: number, No_4_Angle_Deviation: number,
    No_5_Angle_Deviation: number, No_6_Angle_Deviation: number, No_7_Angle_Deviation: number, No_8_Angle_Deviation: number,
    No_9_Angle_Deviation: number, No_10_Angle_Deviation: number, No_11_Angle_Deviation: number, No_12_Angle_Deviation: number,
    No_13_Angle_Deviation: number,
    No_1_NASM_Deviation: number, No_2_NASM_Deviation: number, No_3_NASM_Deviation: number, No_4_NASM_Deviation: number,
    No_5_NASM_Deviation: number, No_6_NASM_Deviation: number, No_7_NASM_Deviation: number, No_8_NASM_Deviation: number,
    No_9_NASM_Deviation: number, No_10_NASM_Deviation: number, No_11_NASM_Deviation: number, No_12_NASM_Deviation: number,
    No_13_NASM_Deviation: number, No_14_NASM_Deviation: number, No_15_NASM_Deviation: number, No_16_NASM_Deviation: number,
    No_17_NASM_Deviation: number, No_18_NASM_Deviation: number, No_19_NASM_Deviation: number, No_20_NASM_Deviation: number,
    No_21_NASM_Deviation: number, No_22_NASM_Deviation: number, No_23_NASM_Deviation: number, No_24_NASM_Deviation: number,
    No_25_NASM_Deviation: number,
    No_1_Time_Deviation: number, No_2_Time_Deviation: number,
    AimoScore: number, EstimatedScore: number
}