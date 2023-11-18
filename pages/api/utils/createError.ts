import { ErrorStage } from '../enums';

export default function createError(
  statuses,
  errorName,
  articleUrl,
  errorStage
) {
  if (errorStage == ErrorStage.Creation) {
    statuses.creationErrors++;
  } else if (errorStage == ErrorStage.Fetching) {
    statuses.fetchingErrors++;
  }

  if (statuses.errors[articleUrl]) {
    statuses.errors[articleUrl][errorStage].push(errorName);
  } else {
    if (errorStage == ErrorStage.Creation) {
      statuses.errors[articleUrl] = {
        fetching: [],
        creation: [errorName],
      };
    } else if (errorStage == ErrorStage.Fetching) {
      statuses.errors[articleUrl] = {
        fetching: [errorName],
        creation: [],
      };
    }
  }
}
