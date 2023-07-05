export interface Level {
  task: string;
  selector: string;
  tableMarkup: string;
  passed?: boolean;
  helperUsed?: boolean;
}

export enum CodeParser {
  indent = '&nbsp;&nbsp;',
  openTag = "<span class='tag'>&lt;</span>",
  closeTag = "<span class='tag'>&gt;</span>",
  openClosingTag = "<span class='tag'>&lt;/</span>",
  closeOpenClosingTag = "<span class='tag'>/ &gt;</span>",
  openWrap = '<div>',
  closeWrap = '</div>',
  attributeSpace = ' ',
  attributeAssignment = "<span class='attribute-assignment'>=</span>",
  assignment = '=',
  quotes = '"',
  // eslint-disable-next-line prettier/prettier
  quotesSchielded = '\"',
  openSpan = '<span ',
  closeOpenSpan = '>',
  closeSpan = '</span>',
  tagName = 'tagname',
  class = 'class',
  attributeName = 'attribute-name',
  attributeValue = 'attribute-value',
}

export enum TechnicalClasses {
  hover = 'hover',
  strobe = 'strobe',
  entrance = 'entrance',
  exit = 'exit',
}

export enum Buttons {
  left = 0,
  right = 1,
}

export enum Styles {
  disablePointerEvents = 'none',
  enablePointerEvents = 'auto',
  disableButton = 1,
  enableButton = 0,
}
