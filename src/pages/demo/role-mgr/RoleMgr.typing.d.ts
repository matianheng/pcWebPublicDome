export interface RoleSearchFormData {
  name?: string
}
/**
 * RoleInfoType
 */
export interface RoleInfoType {
  /**
   * 角色说明
   */
  desc: string
  /**
   * 启用/停用，1.启用 2.停用
   */
  enable: number
  id: number
  /**
   * 角色名
   */
  name: string
  createDate: string
}

export interface AddRoleInfoType {
  /**
   * 角色说明
   */
  desc: string
  id?: number
  /**
   * 启用/停用，1.启用 2.停用
   */
  enable?: number
  /**
   * 角色名
   */
  name: string
  createDate?: string
}
