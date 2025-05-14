# ClassStudentsApi

All URIs are relative to *http://localhost:8000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createClassStudentApiV1ClassStudentsPost**](#createclassstudentapiv1classstudentspost) | **POST** /api/v1/class-students/ | Create Class Student|
|[**deleteClassStudentApiV1ClassStudentsClassStudentIdDelete**](#deleteclassstudentapiv1classstudentsclassstudentiddelete) | **DELETE** /api/v1/class-students/{class_student_id} | Delete Class Student|
|[**readClassStudentApiV1ClassStudentsClassStudentIdGet**](#readclassstudentapiv1classstudentsclassstudentidget) | **GET** /api/v1/class-students/{class_student_id} | Read Class Student|
|[**readClassStudentsApiV1ClassStudentsGet**](#readclassstudentsapiv1classstudentsget) | **GET** /api/v1/class-students/ | Read Class Students|
|[**readClassesByStudentApiV1ClassStudentsStudentStudentIdGet**](#readclassesbystudentapiv1classstudentsstudentstudentidget) | **GET** /api/v1/class-students/student/{student_id} | Read Classes By Student|
|[**readStudentsByClassApiV1ClassStudentsClassClassIdGet**](#readstudentsbyclassapiv1classstudentsclassclassidget) | **GET** /api/v1/class-students/class/{class_id} | Read Students By Class|
|[**updateClassStudentApiV1ClassStudentsClassStudentIdPut**](#updateclassstudentapiv1classstudentsclassstudentidput) | **PUT** /api/v1/class-students/{class_student_id} | Update Class Student|

# **createClassStudentApiV1ClassStudentsPost**
> ClassStudentOut createClassStudentApiV1ClassStudentsPost(classStudentCreate)


### Example

```typescript
import {
    ClassStudentsApi,
    Configuration,
    ClassStudentCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassStudentsApi(configuration);

let classStudentCreate: ClassStudentCreate; //

const { status, data } = await apiInstance.createClassStudentApiV1ClassStudentsPost(
    classStudentCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classStudentCreate** | **ClassStudentCreate**|  | |


### Return type

**ClassStudentOut**

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

# **deleteClassStudentApiV1ClassStudentsClassStudentIdDelete**
> deleteClassStudentApiV1ClassStudentsClassStudentIdDelete()


### Example

```typescript
import {
    ClassStudentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassStudentsApi(configuration);

let classStudentId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteClassStudentApiV1ClassStudentsClassStudentIdDelete(
    classStudentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classStudentId** | [**number**] |  | defaults to undefined|


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

# **readClassStudentApiV1ClassStudentsClassStudentIdGet**
> ClassStudentOut readClassStudentApiV1ClassStudentsClassStudentIdGet()


### Example

```typescript
import {
    ClassStudentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassStudentsApi(configuration);

let classStudentId: number; // (default to undefined)

const { status, data } = await apiInstance.readClassStudentApiV1ClassStudentsClassStudentIdGet(
    classStudentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classStudentId** | [**number**] |  | defaults to undefined|


### Return type

**ClassStudentOut**

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

# **readClassStudentsApiV1ClassStudentsGet**
> Array<ClassStudentOut> readClassStudentsApiV1ClassStudentsGet()


### Example

```typescript
import {
    ClassStudentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassStudentsApi(configuration);

let skip: number; // (optional) (default to 0)
let limit: number; // (optional) (default to 100)

const { status, data } = await apiInstance.readClassStudentsApiV1ClassStudentsGet(
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

**Array<ClassStudentOut>**

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

# **readClassesByStudentApiV1ClassStudentsStudentStudentIdGet**
> Array<ClassStudentOut> readClassesByStudentApiV1ClassStudentsStudentStudentIdGet()


### Example

```typescript
import {
    ClassStudentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassStudentsApi(configuration);

let studentId: number; // (default to undefined)

const { status, data } = await apiInstance.readClassesByStudentApiV1ClassStudentsStudentStudentIdGet(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**number**] |  | defaults to undefined|


### Return type

**Array<ClassStudentOut>**

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

# **readStudentsByClassApiV1ClassStudentsClassClassIdGet**
> Array<ClassStudentOut> readStudentsByClassApiV1ClassStudentsClassClassIdGet()


### Example

```typescript
import {
    ClassStudentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassStudentsApi(configuration);

let classId: number; // (default to undefined)

const { status, data } = await apiInstance.readStudentsByClassApiV1ClassStudentsClassClassIdGet(
    classId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classId** | [**number**] |  | defaults to undefined|


### Return type

**Array<ClassStudentOut>**

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

# **updateClassStudentApiV1ClassStudentsClassStudentIdPut**
> ClassStudentOut updateClassStudentApiV1ClassStudentsClassStudentIdPut(classStudentUpdate)


### Example

```typescript
import {
    ClassStudentsApi,
    Configuration,
    ClassStudentUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassStudentsApi(configuration);

let classStudentId: number; // (default to undefined)
let classStudentUpdate: ClassStudentUpdate; //

const { status, data } = await apiInstance.updateClassStudentApiV1ClassStudentsClassStudentIdPut(
    classStudentId,
    classStudentUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classStudentUpdate** | **ClassStudentUpdate**|  | |
| **classStudentId** | [**number**] |  | defaults to undefined|


### Return type

**ClassStudentOut**

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

