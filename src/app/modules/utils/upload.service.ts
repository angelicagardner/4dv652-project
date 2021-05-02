import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

export interface Upload {
  progress: number
  state: 'PENDING' | 'IN_PROGRESS' | 'DONE'
  body: any
}

function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
  return event.type === HttpEventType.Response
}

function isHttpProgressEvent(
  event: HttpEvent<unknown>
): event is HttpProgressEvent {
  return (
    event.type === HttpEventType.DownloadProgress ||
    event.type === HttpEventType.UploadProgress
  )
}


@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private http: HttpClient) {}

  upload(file: File): Observable<Upload> {
    const data = new FormData()
    data.append('file', file)

    const initialState: Upload = { state: 'PENDING', progress: 0, body: null }

    const calculateState = (upload: Upload, event: HttpEvent<unknown>): Upload => {
      console.log('event',event);
      console.log('upload',upload);

      if (isHttpProgressEvent(event)) {
        return {
          progress: event.total
            ? Math.round((100 * event.loaded) / event.total)
            : upload.progress,
          state: 'IN_PROGRESS',
          body: null
        }
      }
      if (isHttpResponse(event)) {
        return {
          progress: 100,
          state: 'DONE',
          body: event.body
        }
      }
      return upload
    }
    return this.http
      .post('http://rhtrv.com/:8000/api/v3/videoupload', data, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(scan(calculateState, initialState))
  }
}
