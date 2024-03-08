import {
  AjaxUtil,
  extractFileNameFromAxiosResponse,
} from '@/utils/ajax/AjaxUtil'
import {
  ArticleType,
  BasicInfoType,
  DicItemInfo,
  EduInfoType,
  MarkErrorInfoType,
  PageReq,
  PersonInfo,
  SearchFormData,
  UserInfo,
} from './ApiTyping'
import { LsyPageParam, LsyPageResult } from '@/components/lsy/page-table/typing'
import type { UploadRawFile } from 'element-plus'
import { LsyMenuItemType } from '@/components/lsy/menu/typing'
import { cloneDeep } from 'lodash-unified'
import { AxiosResponse } from 'axios'
import {
  AddRoleInfoType,
  RoleInfoType,
  RoleSearchFormData,
} from '../role-mgr/RoleMgr.typing'
const initPageParam: LsyPageParam = { page: 1, size: 20 }

const mockApiPrefix =
  import.meta.env.MODE === 'production' ||
  import.meta.env.VITE_LOCAL_FORCE_USE_PROXY_TARGET === 'true'
    ? import.meta.env.VITE_PROXY_TARGET
    : ''

export async function tabListMockAPI(
  pageReq: PageReq<SearchFormData> = {
    searchParams: { type: 'type-a' },
    pageParams: { ...initPageParam },
  }
) {
  const { searchParams, pageParams = { ...initPageParam } } = pageReq
  const type = searchParams?.type ?? 'type-a'
  const url = `${mockApiPrefix}/api/list/tab/${type}/${pageParams.page}/${pageParams.size}`
  return AjaxUtil.reqGet<LsyPageResult<UserInfo>>(url, {
    params: searchParams,
    cancelSame: true,
    reqFlag: 'tabListMockAPI',
  })
}
export async function dicMockAPI(type: string) {
  const url = `${mockApiPrefix}/api/dic/${type}`
  return AjaxUtil.reqGet<DicItemInfo[]>(url, {
    enableCache: true,
  })
}
export async function loadPersonInfo(account: string) {
  const url = `${mockApiPrefix}/api/person/${account}`
  return AjaxUtil.reqGet<PersonInfo>(url)
}
export async function saveBasic(data: BasicInfoType) {
  const url = `${mockApiPrefix}/api/person/basic/save`
  return AjaxUtil.reqPost<undefined>(url, {
    data,
  })
}
export async function uploadFile(file: UploadRawFile, otherParam: string) {
  const url = `${mockApiPrefix}/api/person/upload`
  const form = new FormData()
  form.append('file', file)
  form.append('otherParam', otherParam)
  return AjaxUtil.reqPost<string | undefined>(url, { data: form })
}
export async function saveMarkError(markErrorInfo: MarkErrorInfoType) {
  const url = `${mockApiPrefix}/api/person/save-mark-error`
  return AjaxUtil.reqPost<string>(url, {
    data: markErrorInfo,
  })
}
export async function cancelMarkError(id: string) {
  const url = `${mockApiPrefix}/api/person/cancel-mark-error`
  return AjaxUtil.reqPost<string | undefined>(url, {
    data: {
      id,
    },
  })
}
export async function loadMarkError(account: string) {
  const url = `${mockApiPrefix}/api/person/loading-mark-error/${account}`
  return AjaxUtil.reqGet<MarkErrorInfoType[]>(url)
}
export async function loadMenuData(loginFlag: string) {
  const url = `${mockApiPrefix}/api/menu/${loginFlag}`
  return AjaxUtil.reqGet<LsyMenuItemType[]>(url)
}
export async function login(account: string, pwd: string) {
  const url = `${mockApiPrefix}/api/login`
  return AjaxUtil.reqPost<string | undefined>(url, { data: { account, pwd } })
}
export async function addEduInfo(eduInfo: EduInfoType) {
  const tmp = cloneDeep(eduInfo)
  delete tmp.dateRange
  const url = `${mockApiPrefix}/api/save-edu-info`
  return AjaxUtil.reqPost<string>(url, { data: tmp })
}
export async function updateEduInfo(eduInfo: EduInfoType) {
  const tmp = cloneDeep(eduInfo)
  delete tmp.dateRange
  const url = `${mockApiPrefix}/api/save-edu-info`
  return AjaxUtil.reqPost<undefined>(url, { data: tmp })
}

export async function delEduInfo(id: string) {
  const url = `${mockApiPrefix}/api/del-edu-info`
  return AjaxUtil.reqPost<undefined>(url, { data: { id } })
}

export async function approval(status: string) {
  const url = `${mockApiPrefix}/api/approval/${status}`
  return AjaxUtil.reqPost<undefined>(url, { data: { status: status } })
}
export async function exportData(exp: boolean) {
  const url = `${mockApiPrefix}/local-mock-api/data-export/${
    exp ? 'exp' : 'suc'
  }`
  const resp = await AjaxUtil.reqPost<AxiosResponse>(url, {
    responseType: 'blob',
  })
  return {
    fileName: extractFileNameFromAxiosResponse(resp, 'test.xlsx'),
    blob: new Blob([resp.data]),
  }
}
export async function downloadPdf() {
  const url = `${mockApiPrefix}/local-mock-api/pdf`
  const resp = await AjaxUtil.reqPost<AxiosResponse>(url, {
    responseType: 'blob',
  })
  return {
    fileName: extractFileNameFromAxiosResponse(resp, 'test.xlsx'),
    blob: new Blob([resp.data]),
  }
}

export async function searchArticle(pageNum: number) {
  const url = `${mockApiPrefix}/api/article-list/${pageNum}`
  return AjaxUtil.reqGet<LsyPageResult<ArticleType[]>>(url)
}
export async function searchArticleBaseId(flag: string, id = '25') {
  const url = `${mockApiPrefix}/api/article-list-base-id`
  return AjaxUtil.reqGet<LsyPageResult<ArticleType[]>>(url, {
    params: { flag, id, size: 15 },
  })
}

export async function searchArticleBaseId2({
  flag,
  id,
  classify,
}: {
  flag: string
  id?: string
  classify?: number | string
}) {
  const url = `${mockApiPrefix}/api/article-list-base-id`
  return AjaxUtil.reqGet<LsyPageResult<ArticleType[]>>(url, {
    params: { flag, id, size: 15, classify },
  })
}
export async function roleListMockAPI(
  pageReq: PageReq<RoleSearchFormData> = {
    searchParams: { name: '' },
    pageParams: { ...initPageParam },
  }
) {
  const url = `${mockApiPrefix}/api/role`
  return AjaxUtil.reqGet<LsyPageResult<RoleInfoType>>(url, {
    params: pageReq,
    cancelSame: true,
    reqFlag: 'roleListMockAPI',
  })
}
const roleDetailReqFlag = 'roleDetailMockAPI'
export async function roleDetailMockAPI(id: number) {
  const url = `${mockApiPrefix}/api/role/${id}`
  return AjaxUtil.reqGet<RoleInfoType | null>(url, {
    cancelSame: true,
    reqFlag: roleDetailReqFlag,
  })
}

export async function cancelRoleDetailAPI() {
  AjaxUtil.cancelReqByReqFlag(roleDetailReqFlag)
}

export async function addRoleMockAPI(roleInfo: AddRoleInfoType) {
  const url = `${mockApiPrefix}/api/role`
  return AjaxUtil.reqPost<void>(url, {
    data: roleInfo,
    cancelSame: true,
    reqFlag: 'addRoleMockAPI',
  })
}

export async function updateRoleMockAPI(roleInfo: AddRoleInfoType) {
  const url = `${mockApiPrefix}/api/role`
  return AjaxUtil.reqPut<void>(url, {
    data: roleInfo,
    cancelSame: true,
    reqFlag: 'updateRoleMockAPI',
  })
}
