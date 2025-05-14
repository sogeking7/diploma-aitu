# AttendancesApi

All URIs are relative to *http://localhost:8000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createAttendanceApiV1AttendancesPost**](#createattendanceapiv1attendancespost) | **POST** /api/v1/attendances/ | Create Attendance|
|[**deleteAttendanceApiV1AttendancesAttendanceIdDelete**](#deleteattendanceapiv1attendancesattendanceiddelete) | **DELETE** /api/v1/attendances/{attendance_id} | Delete Attendance|
|[**readAttendanceApiV1AttendancesAttendanceIdGet**](#readattendanceapiv1attendancesattendanceidget) | **GET** /api/v1/attendances/{attendance_id} | Read Attendance|
|[**readAttendancesApiV1AttendancesGet**](#readattendancesapiv1attendancesget) | **GET** /api/v1/attendances/ | Read Attendances|
|[**readAttendancesByDateRangeApiV1AttendancesDateRangeGet**](#readattendancesbydaterangeapiv1attendancesdaterangeget) | **GET** /api/v1/attendances/date-range | Read Attendances By Date Range|
|[**readAttendancesByStudentApiV1AttendancesStudentStudentIdGet**](#readattendancesbystudentapiv1attendancesstudentstudentidget) | **GET** /api/v1/attendances/student/{student_id} | Read Attendances By Student|
|[**updateAttendanceApiV1AttendancesAttendanceIdPut**](#updateattendanceapiv1attendancesattendanceidput) | **PUT** /api/v1/attendances/{attendance_id} | Update Attendance|

# **createAttendanceApiV1AttendancesPost**
> AttendanceOut createAttendanceApiV1AttendancesPost(attendanceCreate)


### Example

```typescript
import {
    AttendancesApi,
    Configuration,
    AttendanceCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new AttendancesApi(configuration);

let attendanceCreate: AttendanceCreate; //

const { status, data } = await apiInstance.createAttendanceApiV1AttendancesPost(
    attendanceCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **attendanceCreate** | **AttendanceCreate**|  | |


### Return type

**AttendanceOut**

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

# **deleteAttendanceApiV1AttendancesAttendanceIdDelete**
> deleteAttendanceApiV1AttendancesAttendanceIdDelete()


### Example

```typescript
import {
    AttendancesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AttendancesApi(configuration);

let attendanceId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteAttendanceApiV1AttendancesAttendanceIdDelete(
    attendanceId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **attendanceId** | [**number**] |  | defaults to undefined|


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

# **readAttendanceApiV1AttendancesAttendanceIdGet**
> AttendanceOut readAttendanceApiV1AttendancesAttendanceIdGet()


### Example

```typescript
import {
    AttendancesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AttendancesApi(configuration);

let attendanceId: number; // (default to undefined)

const { status, data } = await apiInstance.readAttendanceApiV1AttendancesAttendanceIdGet(
    attendanceId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **attendanceId** | [**number**] |  | defaults to undefined|


### Return type

**AttendanceOut**

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

# **readAttendancesApiV1AttendancesGet**
> Array<AttendanceOut> readAttendancesApiV1AttendancesGet()


### Example

```typescript
import {
    AttendancesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AttendancesApi(configuration);

let skip: number; // (optional) (default to 0)
let limit: number; // (optional) (default to 100)

const { status, data } = await apiInstance.readAttendancesApiV1AttendancesGet(
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

**Array<AttendanceOut>**

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

# **readAttendancesByDateRangeApiV1AttendancesDateRangeGet**
> Array<AttendanceOut> readAttendancesByDateRangeApiV1AttendancesDateRangeGet()


### Example

```typescript
import {
    AttendancesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AttendancesApi(configuration);

let startDate: string; //Start date for attendance records (default to undefined)
let endDate: string; //End date for attendance records (default to undefined)

const { status, data } = await apiInstance.readAttendancesByDateRangeApiV1AttendancesDateRangeGet(
    startDate,
    endDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **startDate** | [**string**] | Start date for attendance records | defaults to undefined|
| **endDate** | [**string**] | End date for attendance records | defaults to undefined|


### Return type

**Array<AttendanceOut>**

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

# **readAttendancesByStudentApiV1AttendancesStudentStudentIdGet**
> Array<AttendanceOut> readAttendancesByStudentApiV1AttendancesStudentStudentIdGet()


### Example

```typescript
import {
    AttendancesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AttendancesApi(configuration);

let studentId: number; // (default to undefined)

const { status, data } = await apiInstance.readAttendancesByStudentApiV1AttendancesStudentStudentIdGet(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**number**] |  | defaults to undefined|


### Return type

**Array<AttendanceOut>**

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

# **updateAttendanceApiV1AttendancesAttendanceIdPut**
> AttendanceOut updateAttendanceApiV1AttendancesAttendanceIdPut(attendanceUpdate)


### Example

```typescript
import {
    AttendancesApi,
    Configuration,
    AttendanceUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new AttendancesApi(configuration);

let attendanceId: number; // (default to undefined)
let attendanceUpdate: AttendanceUpdate; //

const { status, data } = await apiInstance.updateAttendanceApiV1AttendancesAttendanceIdPut(
    attendanceId,
    attendanceUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **attendanceUpdate** | **AttendanceUpdate**|  | |
| **attendanceId** | [**number**] |  | defaults to undefined|


### Return type

**AttendanceOut**

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

