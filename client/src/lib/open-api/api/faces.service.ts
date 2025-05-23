/**
 * Diploma FastAPI
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec, HttpContext 
        }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

// @ts-ignore
import { HTTPValidationError } from '../model/http-validation-error';
// @ts-ignore
import { PageFaceOut } from '../model/page-face-out';
// @ts-ignore
import { SearchFaceMatch } from '../model/search-face-match';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';
import { BaseService } from '../api.base.service';



@Injectable({
  providedIn: 'root'
})
export class FacesService extends BaseService {

    constructor(protected httpClient: HttpClient, @Optional() @Inject(BASE_PATH) basePath: string|string[], @Optional() configuration?: Configuration) {
        super(basePath, configuration);
    }

    /**
     * Add Face
     * @param userId 
     * @param image 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public addFace(userId: number, image: Blob, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<any>;
    public addFace(userId: number, image: Blob, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<any>>;
    public addFace(userId: number, image: Blob, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<any>>;
    public addFace(userId: number, image: Blob, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<any> {
        if (userId === null || userId === undefined) {
            throw new Error('Required parameter userId was null or undefined when calling addFace.');
        }
        if (image === null || image === undefined) {
            throw new Error('Required parameter image was null or undefined when calling addFace.');
        }

        let localVarHeaders = this.defaultHeaders;

        const localVarHttpHeaderAcceptSelected: string | undefined = options?.httpHeaderAccept ?? this.configuration.selectHeaderAccept([
            'application/json'
        ]);
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        const localVarHttpContext: HttpContext = options?.context ?? new HttpContext();

        const localVarTransferCache: boolean = options?.transferCache ?? true;

        // to determine the Content-Type header
        const consumes: string[] = [
            'multipart/form-data'
        ];

        const canConsumeForm = this.canConsumeForm(consumes);

        let localVarFormParams: { append(param: string, value: any): any; };
        let localVarUseForm = false;
        let localVarConvertFormParamsToString = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        // see https://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data
        localVarUseForm = canConsumeForm;
        if (localVarUseForm) {
            localVarFormParams = new FormData();
        } else {
            localVarFormParams = new HttpParams({encoder: this.encoder});
        }

        if (userId !== undefined) {
            localVarFormParams = localVarFormParams.append('user_id', <any>userId) as any || localVarFormParams;
        }
        if (image !== undefined) {
            localVarFormParams = localVarFormParams.append('image', <any>image) as any || localVarFormParams;
        }

        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/api/v1/faces/add_face`;
        const { basePath, withCredentials } = this.configuration;
        return this.httpClient.request<any>('post', `${basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: localVarConvertFormParamsToString ? localVarFormParams.toString() : localVarFormParams,
                responseType: <any>responseType_,
                ...(withCredentials ? { withCredentials } : {}),
                headers: localVarHeaders,
                observe: observe,
                transferCache: localVarTransferCache,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Delete Face
     * @param faceId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteFace(faceId: number, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<any>;
    public deleteFace(faceId: number, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<any>>;
    public deleteFace(faceId: number, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<any>>;
    public deleteFace(faceId: number, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<any> {
        if (faceId === null || faceId === undefined) {
            throw new Error('Required parameter faceId was null or undefined when calling deleteFace.');
        }

        let localVarHeaders = this.defaultHeaders;

        const localVarHttpHeaderAcceptSelected: string | undefined = options?.httpHeaderAccept ?? this.configuration.selectHeaderAccept([
            'application/json'
        ]);
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        const localVarHttpContext: HttpContext = options?.context ?? new HttpContext();

        const localVarTransferCache: boolean = options?.transferCache ?? true;


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/api/v1/faces/${this.configuration.encodeParam({name: "faceId", value: faceId, in: "path", style: "simple", explode: false, dataType: "number", dataFormat: undefined})}`;
        const { basePath, withCredentials } = this.configuration;
        return this.httpClient.request<any>('delete', `${basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                responseType: <any>responseType_,
                ...(withCredentials ? { withCredentials } : {}),
                headers: localVarHeaders,
                observe: observe,
                transferCache: localVarTransferCache,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get Faces
     * @param page Page number
     * @param size Page size
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getFaces(page?: number, size?: number, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<PageFaceOut>;
    public getFaces(page?: number, size?: number, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<PageFaceOut>>;
    public getFaces(page?: number, size?: number, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<PageFaceOut>>;
    public getFaces(page?: number, size?: number, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<any> {

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
          <any>page, 'page');
        localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
          <any>size, 'size');

        let localVarHeaders = this.defaultHeaders;

        const localVarHttpHeaderAcceptSelected: string | undefined = options?.httpHeaderAccept ?? this.configuration.selectHeaderAccept([
            'application/json'
        ]);
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        const localVarHttpContext: HttpContext = options?.context ?? new HttpContext();

        const localVarTransferCache: boolean = options?.transferCache ?? true;


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/api/v1/faces/`;
        const { basePath, withCredentials } = this.configuration;
        return this.httpClient.request<PageFaceOut>('get', `${basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                params: localVarQueryParameters,
                responseType: <any>responseType_,
                ...(withCredentials ? { withCredentials } : {}),
                headers: localVarHeaders,
                observe: observe,
                transferCache: localVarTransferCache,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Health Check
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public healthCheck(observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<any>;
    public healthCheck(observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<any>>;
    public healthCheck(observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<any>>;
    public healthCheck(observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<any> {

        let localVarHeaders = this.defaultHeaders;

        const localVarHttpHeaderAcceptSelected: string | undefined = options?.httpHeaderAccept ?? this.configuration.selectHeaderAccept([
            'application/json'
        ]);
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        const localVarHttpContext: HttpContext = options?.context ?? new HttpContext();

        const localVarTransferCache: boolean = options?.transferCache ?? true;


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/api/v1/faces/health`;
        const { basePath, withCredentials } = this.configuration;
        return this.httpClient.request<any>('get', `${basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                responseType: <any>responseType_,
                ...(withCredentials ? { withCredentials } : {}),
                headers: localVarHeaders,
                observe: observe,
                transferCache: localVarTransferCache,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Read Face
     * @param faceId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public readFace(faceId: number, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<any>;
    public readFace(faceId: number, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<any>>;
    public readFace(faceId: number, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<any>>;
    public readFace(faceId: number, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<any> {
        if (faceId === null || faceId === undefined) {
            throw new Error('Required parameter faceId was null or undefined when calling readFace.');
        }

        let localVarHeaders = this.defaultHeaders;

        const localVarHttpHeaderAcceptSelected: string | undefined = options?.httpHeaderAccept ?? this.configuration.selectHeaderAccept([
            'application/json'
        ]);
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        const localVarHttpContext: HttpContext = options?.context ?? new HttpContext();

        const localVarTransferCache: boolean = options?.transferCache ?? true;


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/api/v1/faces/${this.configuration.encodeParam({name: "faceId", value: faceId, in: "path", style: "simple", explode: false, dataType: "number", dataFormat: undefined})}`;
        const { basePath, withCredentials } = this.configuration;
        return this.httpClient.request<any>('get', `${basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                responseType: <any>responseType_,
                ...(withCredentials ? { withCredentials } : {}),
                headers: localVarHeaders,
                observe: observe,
                transferCache: localVarTransferCache,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Search Face
     * @param image 
     * @param threshold 
     * @param k 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public searchFace(image: Blob, threshold?: number, k?: number, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<SearchFaceMatch>;
    public searchFace(image: Blob, threshold?: number, k?: number, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpResponse<SearchFaceMatch>>;
    public searchFace(image: Blob, threshold?: number, k?: number, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<HttpEvent<SearchFaceMatch>>;
    public searchFace(image: Blob, threshold?: number, k?: number, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext, transferCache?: boolean}): Observable<any> {
        if (image === null || image === undefined) {
            throw new Error('Required parameter image was null or undefined when calling searchFace.');
        }

        let localVarHeaders = this.defaultHeaders;

        const localVarHttpHeaderAcceptSelected: string | undefined = options?.httpHeaderAccept ?? this.configuration.selectHeaderAccept([
            'application/json'
        ]);
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        const localVarHttpContext: HttpContext = options?.context ?? new HttpContext();

        const localVarTransferCache: boolean = options?.transferCache ?? true;

        // to determine the Content-Type header
        const consumes: string[] = [
            'multipart/form-data'
        ];

        const canConsumeForm = this.canConsumeForm(consumes);

        let localVarFormParams: { append(param: string, value: any): any; };
        let localVarUseForm = false;
        let localVarConvertFormParamsToString = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        // see https://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data
        localVarUseForm = canConsumeForm;
        if (localVarUseForm) {
            localVarFormParams = new FormData();
        } else {
            localVarFormParams = new HttpParams({encoder: this.encoder});
        }

        if (image !== undefined) {
            localVarFormParams = localVarFormParams.append('image', <any>image) as any || localVarFormParams;
        }
        if (threshold !== undefined) {
            localVarFormParams = localVarFormParams.append('threshold', <any>threshold) as any || localVarFormParams;
        }
        if (k !== undefined) {
            localVarFormParams = localVarFormParams.append('k', <any>k) as any || localVarFormParams;
        }

        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        let localVarPath = `/api/v1/faces/search_face`;
        const { basePath, withCredentials } = this.configuration;
        return this.httpClient.request<SearchFaceMatch>('post', `${basePath}${localVarPath}`,
            {
                context: localVarHttpContext,
                body: localVarConvertFormParamsToString ? localVarFormParams.toString() : localVarFormParams,
                responseType: <any>responseType_,
                ...(withCredentials ? { withCredentials } : {}),
                headers: localVarHeaders,
                observe: observe,
                transferCache: localVarTransferCache,
                reportProgress: reportProgress
            }
        );
    }

}
