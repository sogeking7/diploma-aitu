/**
 * Diploma FastAPI
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { AppSchemasUserUserBase } from './app-schemas-user-user-base';


export interface ParentStudentOut { 
    parent_user_id: number;
    student_user_id: number;
    id: number;
    parent_user: AppSchemasUserUserBase | null;
    student_user: AppSchemasUserUserBase | null;
}

