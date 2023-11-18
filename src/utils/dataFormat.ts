import _ from 'lodash';

export function unescapeArray(dataArray) {
  return dataArray.map((element) => _.unescape(element));
}
