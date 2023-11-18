export enum ErrorStage {
  Fetching = 'fetching',
  Creation = 'creation',
}

export enum ErrorType {
  ProblematicParagraphs = 'problematicParagraphs',
  MissingData = 'missingData',
  GeneralCantFetch = 'generalCantFetch',
  FetchPromiseRejected = 'fetchPromiseRejected',
  CreatePromiseRejected = 'createPromiseRejected',
  InexistentCategory = 'inexistentCategory',
  DuplicatedArticle = 'duplicatedArticle',
  GeneralCantCreate = 'generalCantCreate',
}
