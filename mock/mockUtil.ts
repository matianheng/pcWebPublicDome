export function buildPageData(list: any, total: number, query: any) {
  return {
    code: 200,
    msg: '',
    data: {
      list: list,
      total: total,
      page: parseInt(query.page),
      size: parseInt(query.size),
    },
  }
}
export function incrementId(step: number, startNum: number) {
  let tmpStartNum = startNum
  return () => {
    tmpStartNum += step
    return tmpStartNum
  }
}
export function incrementIdFromQueryParam(query: any) {
  const { size, page } = query
  return incrementId(1, (parseInt(page) - 1) * parseInt(size))
}
export default {}
