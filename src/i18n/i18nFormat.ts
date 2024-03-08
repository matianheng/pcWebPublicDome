// 配置日期格式化
export const dateTimeFormats = {
  'en-US': {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
    },
  },
  'zh-CN': {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      // 默认是24小时制，如果想显示为12小时制，则进行下面这个属性的设置
      //   hour12: true,
    },
  },
}

// 配置数字相关的格式化
export const numberFormats = {
  'en-US': {
    currency: {
      style: 'currency',
      currency: 'USD',
    },
    decimal: {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    percent: {
      style: 'percent',
      useGrouping: false,
    },
  },
  'zh-CN': {
    currency: {
      style: 'currency',
      currency: 'RMB',
    },
    decimal: {
      style: 'decimal',
      minimumSignificantDigits: 3,
      maximumSignificantDigits: 5,
    },
    percent: {
      style: 'percent',
      useGrouping: false,
    },
  },
}
