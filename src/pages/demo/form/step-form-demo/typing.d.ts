export interface StepForm02DataType {
  nikeName?: string
  age?: number
}
export interface StepForm01DataType {
  name?: string
}

export interface StepFormDataType {
  step01Data?: StepForm01DataType
  step02Data?: StepForm02DataType
}
export interface StepFormComp {
  elFormRef: FormInstance
  stepFormData: StepFormDataType
  formData: StepForm01DataType | StepForm02DataType
}
