import {RoleEnum} from './open-api';

export function getRoleTagColor(role: RoleEnum): string {
  switch (role) {
    case RoleEnum.admin:
      return 'purple';
    case RoleEnum.parent:
      return 'orange';
    case RoleEnum.student:
      return 'green';
    case RoleEnum.teacher:
      return 'red';
    default:
      return 'default';
  }
}
