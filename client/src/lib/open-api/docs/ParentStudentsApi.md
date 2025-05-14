# ParentStudentsApi

All URIs are relative to *http://localhost:8000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createParentStudentApiV1ParentStudentsPost**](#createparentstudentapiv1parentstudentspost) | **POST** /api/v1/parent-students/ | Create Parent Student|
|[**deleteParentStudentApiV1ParentStudentsParentStudentIdDelete**](#deleteparentstudentapiv1parentstudentsparentstudentiddelete) | **DELETE** /api/v1/parent-students/{parent_student_id} | Delete Parent Student|
|[**readParentStudentApiV1ParentStudentsParentStudentIdGet**](#readparentstudentapiv1parentstudentsparentstudentidget) | **GET** /api/v1/parent-students/{parent_student_id} | Read Parent Student|
|[**readParentStudentsApiV1ParentStudentsGet**](#readparentstudentsapiv1parentstudentsget) | **GET** /api/v1/parent-students/ | Read Parent Students|
|[**readParentsByStudentApiV1ParentStudentsStudentStudentIdGet**](#readparentsbystudentapiv1parentstudentsstudentstudentidget) | **GET** /api/v1/parent-students/student/{student_id} | Read Parents By Student|
|[**readStudentsByParentApiV1ParentStudentsParentParentIdGet**](#readstudentsbyparentapiv1parentstudentsparentparentidget) | **GET** /api/v1/parent-students/parent/{parent_id} | Read Students By Parent|
|[**updateParentStudentApiV1ParentStudentsParentStudentIdPut**](#updateparentstudentapiv1parentstudentsparentstudentidput) | **PUT** /api/v1/parent-students/{parent_student_id} | Update Parent Student|

# **createParentStudentApiV1ParentStudentsPost**
> ParentStudentOut createParentStudentApiV1ParentStudentsPost(parentStudentCreate)


### Example

```typescript
import {
    ParentStudentsApi,
    Configuration,
    ParentStudentCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new ParentStudentsApi(configuration);

let parentStudentCreate: ParentStudentCreate; //

const { status, data } = await apiInstance.createParentStudentApiV1ParentStudentsPost(
    parentStudentCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **parentStudentCreate** | **ParentStudentCreate**|  | |


### Return type

**ParentStudentOut**

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

# **deleteParentStudentApiV1ParentStudentsParentStudentIdDelete**
> deleteParentStudentApiV1ParentStudentsParentStudentIdDelete()


### Example

```typescript
import {
    ParentStudentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ParentStudentsApi(configuration);

let parentStudentId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteParentStudentApiV1ParentStudentsParentStudentIdDelete(
    parentStudentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **parentStudentId** | [**number**] |  | defaults to undefined|


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

# **readParentStudentApiV1ParentStudentsParentStudentIdGet**
> ParentStudentOut readParentStudentApiV1ParentStudentsParentStudentIdGet()


### Example

```typescript
import {
    ParentStudentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ParentStudentsApi(configuration);

let parentStudentId: number; // (default to undefined)

const { status, data } = await apiInstance.readParentStudentApiV1ParentStudentsParentStudentIdGet(
    parentStudentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **parentStudentId** | [**number**] |  | defaults to undefined|


### Return type

**ParentStudentOut**

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

# **readParentStudentsApiV1ParentStudentsGet**
> Array<ParentStudentOut> readParentStudentsApiV1ParentStudentsGet()


### Example

```typescript
import {
    ParentStudentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ParentStudentsApi(configuration);

let skip: number; // (optional) (default to 0)
let limit: number; // (optional) (default to 100)

const { status, data } = await apiInstance.readParentStudentsApiV1ParentStudentsGet(
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

**Array<ParentStudentOut>**

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

# **readParentsByStudentApiV1ParentStudentsStudentStudentIdGet**
> Array<ParentStudentOut> readParentsByStudentApiV1ParentStudentsStudentStudentIdGet()


### Example

```typescript
import {
    ParentStudentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ParentStudentsApi(configuration);

let studentId: number; // (default to undefined)

const { status, data } = await apiInstance.readParentsByStudentApiV1ParentStudentsStudentStudentIdGet(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**number**] |  | defaults to undefined|


### Return type

**Array<ParentStudentOut>**

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

# **readStudentsByParentApiV1ParentStudentsParentParentIdGet**
> Array<ParentStudentOut> readStudentsByParentApiV1ParentStudentsParentParentIdGet()


### Example

```typescript
import {
    ParentStudentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ParentStudentsApi(configuration);

let parentId: number; // (default to undefined)

const { status, data } = await apiInstance.readStudentsByParentApiV1ParentStudentsParentParentIdGet(
    parentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **parentId** | [**number**] |  | defaults to undefined|


### Return type

**Array<ParentStudentOut>**

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

# **updateParentStudentApiV1ParentStudentsParentStudentIdPut**
> ParentStudentOut updateParentStudentApiV1ParentStudentsParentStudentIdPut(parentStudentUpdate)


### Example

```typescript
import {
    ParentStudentsApi,
    Configuration,
    ParentStudentUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new ParentStudentsApi(configuration);

let parentStudentId: number; // (default to undefined)
let parentStudentUpdate: ParentStudentUpdate; //

const { status, data } = await apiInstance.updateParentStudentApiV1ParentStudentsParentStudentIdPut(
    parentStudentId,
    parentStudentUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **parentStudentUpdate** | **ParentStudentUpdate**|  | |
| **parentStudentId** | [**number**] |  | defaults to undefined|


### Return type

**ParentStudentOut**

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

