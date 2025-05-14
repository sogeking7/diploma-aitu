# ClassesApi

All URIs are relative to *http://localhost:8000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createClassApiV1ClassesPost**](#createclassapiv1classespost) | **POST** /api/v1/classes/ | Create Class|
|[**deleteClassApiV1ClassesClassIdDelete**](#deleteclassapiv1classesclassiddelete) | **DELETE** /api/v1/classes/{class_id} | Delete Class|
|[**readClassApiV1ClassesClassIdGet**](#readclassapiv1classesclassidget) | **GET** /api/v1/classes/{class_id} | Read Class|
|[**readClassesApiV1ClassesGet**](#readclassesapiv1classesget) | **GET** /api/v1/classes/ | Read Classes|
|[**readClassesByTeacherApiV1ClassesTeacherTeacherIdGet**](#readclassesbyteacherapiv1classesteacherteacheridget) | **GET** /api/v1/classes/teacher/{teacher_id} | Read Classes By Teacher|
|[**updateClassApiV1ClassesClassIdPut**](#updateclassapiv1classesclassidput) | **PUT** /api/v1/classes/{class_id} | Update Class|

# **createClassApiV1ClassesPost**
> ClassOut createClassApiV1ClassesPost(classCreate)


### Example

```typescript
import {
    ClassesApi,
    Configuration,
    ClassCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassesApi(configuration);

let classCreate: ClassCreate; //

const { status, data } = await apiInstance.createClassApiV1ClassesPost(
    classCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classCreate** | **ClassCreate**|  | |


### Return type

**ClassOut**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteClassApiV1ClassesClassIdDelete**
> deleteClassApiV1ClassesClassIdDelete()


### Example

```typescript
import {
    ClassesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassesApi(configuration);

let classId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteClassApiV1ClassesClassIdDelete(
    classId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classId** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **readClassApiV1ClassesClassIdGet**
> ClassOut readClassApiV1ClassesClassIdGet()


### Example

```typescript
import {
    ClassesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassesApi(configuration);

let classId: number; // (default to undefined)

const { status, data } = await apiInstance.readClassApiV1ClassesClassIdGet(
    classId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classId** | [**number**] |  | defaults to undefined|


### Return type

**ClassOut**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **readClassesApiV1ClassesGet**
> Array<ClassOut> readClassesApiV1ClassesGet()


### Example

```typescript
import {
    ClassesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassesApi(configuration);

let skip: number; // (optional) (default to 0)
let limit: number; // (optional) (default to 100)

const { status, data } = await apiInstance.readClassesApiV1ClassesGet(
    skip,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **skip** | [**number**] |  | (optional) defaults to 0|
| **limit** | [**number**] |  | (optional) defaults to 100|


### Return type

**Array<ClassOut>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **readClassesByTeacherApiV1ClassesTeacherTeacherIdGet**
> Array<ClassOut> readClassesByTeacherApiV1ClassesTeacherTeacherIdGet()


### Example

```typescript
import {
    ClassesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassesApi(configuration);

let teacherId: number; // (default to undefined)

const { status, data } = await apiInstance.readClassesByTeacherApiV1ClassesTeacherTeacherIdGet(
    teacherId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teacherId** | [**number**] |  | defaults to undefined|


### Return type

**Array<ClassOut>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateClassApiV1ClassesClassIdPut**
> ClassOut updateClassApiV1ClassesClassIdPut(classUpdate)


### Example

```typescript
import {
    ClassesApi,
    Configuration,
    ClassUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassesApi(configuration);

let classId: number; // (default to undefined)
let classUpdate: ClassUpdate; //

const { status, data } = await apiInstance.updateClassApiV1ClassesClassIdPut(
    classId,
    classUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classUpdate** | **ClassUpdate**|  | |
| **classId** | [**number**] |  | defaults to undefined|


### Return type

**ClassOut**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

