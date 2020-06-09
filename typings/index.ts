export interface IAppButtonDetail extends IPushButtonDetail {
  visible?: string[] | string;
}

export interface IAppActionDetail extends IWidgetEventDetail {

}

export interface IMenuItemDetail extends IWidgetEventDetail {
  link?: string;
  appKey?: string;
}

export interface ICustomDetail extends IWidgetDataDetail {
  fileName?: string;
}

export interface IAttachmentsDetail extends IWidgetDetail {
  url?: string;
}

export interface ITreeDetail extends IWidgetDataDetail,IWidgetEventDetail {
  keyAttribute?: string;
  displayAttribute?: string;
  treeAttribute?: string;
  width?: number;
  height?: number;
  expanded?: boolean;
}

export interface ITextboxDetail extends IWidgetDataDetail {
  width?: number;
}

export interface IMultipartTextboxDetail extends IWidgetDataDetail {
  descDataAttribute?: string;
  descInputMode?: 'default' | 'readonly' | 'required' | 'query';
  width?: number;
}

export interface ITableDetail extends IWidgetDetail {
  objName?: string;
  whereClause?: string;
  orderBy?: string;
  relationship?: string;
  dataSrc?: string;
  beanClass?: string;
  width?: number;
  inputMode?: 'default' | 'readonly' | 'required' | 'query';
  selectMode?: 'single' | 'multiple';
  pageSize?: number;
  isMain?: boolean;
  bordered?: boolean;
  expandable?: boolean;
  expandedFirstRow?: boolean;
  filterable?: boolean;
  addable?: boolean;
}

export interface ITableColDetail extends IWidgetDataDetail,IWidgetEventDetail {
  parentLabel?: string;
  eventType?: 'event' | 'link';
  sortable?: boolean;
  filterable?: boolean;
  onDataChange?: 'refreshTable' | 'resetChildren';
  width?: number;
  align?: 'left' | 'center' | 'right';
}

export interface ITabGroupDetail extends IWidgetDetail {
  isMain?: boolean;
}

export interface ITabDetail extends IWidgetDetail {
  type?: 'list' | 'insert';
  visible?: boolean;
  icon?: string;
}

export interface IStaticTextDetail extends IWidgetDetail {
  align?: 'left' | 'center' | 'right';
}

export interface ISectionDetail extends IWidgetDetail {
  labelAlign?: 'left' | 'center' | 'right';
}


export interface ISectionRowDetail extends IWidgetDetail {
  labelAlign?: 'left' | 'center' | 'right';
}

export interface ISectionColDetail extends IWidgetDetail {
  width?: number;
  labelAlign?: 'left' | 'center' | 'right';
}

export interface IRadioButtonGroupDetail extends IWidgetDataDetail {
  keyAttribute?: string;
  displayAttribute?: string;
}

export interface IRadioButtonDetail extends IWidgetDetail {
  value?: string;
}

export interface IPushButtonDetail extends IWidgetEventDetail {
  size?: 'small' | 'middle' | 'large';
  isDefault?: boolean;
  menuType?: string;
}

export interface IMultilineTextboxDetail extends IWidgetDataDetail {
  rows?: number;
  width?: number;
}

export interface IImageDetail extends IWidgetDetail {
  dataAttribute?: string;
  dataSrc?: string;
  height?: number;
  width?: number;
  thumbnail?: boolean;
  url?: string;
}

export interface IHyperlinkDetail extends IWidgetEventDetail {
  align?: 'left' | 'center' | 'right';
  image?: string;
  imageAlign?: 'left' | 'center' | 'right';
  show?: boolean;
}

export interface IDialogDetail extends IWidgetDetail {
  visible?: boolean;
  inputMode?: 'default' | 'readonly' | 'query';
  modelName?: string;
  editVisible?: boolean;
  width?: number;
  targetId?: string;
  dataSrc?: string;
}

export interface IDatasrcDetail extends IWidgetDetail {
  modelName?: string;
  objName?: string;
  relationship?: string;
  orderBy?: string;
  whereClause?: string;
}

export interface IComboboxDetail extends IWidgetDataDetail {
  keyAttribute?: string;
  displayAttribute?: string;
  listAttribute?: string;
  width?: number;
}

export interface ICheckboxDetail extends IWidgetDataDetail {

}

export interface IButtonGroupDetail extends IWidgetDetail {
  labelAlign?: 'left' | 'center' | 'right';
  align?: 'left' | 'center' | 'right';
  show?: boolean;
}

export interface ICanvasDetail extends IWidgetDetail {
  modelName: string;
  objName?: string;
  orderBy?: string;
  whereClause?: string;
  resultsTableId?: string;
}

export interface IWidgetEventDetail extends IWidgetDetail {
  event?: string;
  eventValue?: string;
  targetId?: string;
  icon?: string;
}

export interface IWidgetDataDetail extends IWidgetDetail {
  hideLabel?: boolean;
  dataAttribute?: string;
  dataType?: 'string' | 'number' | 'datetime' | 'boolean';
  precision?: number;
  dateFormat?: string;
  objName?: string;
  dataSrc?: string;
  isMain?: boolean;
  inputMode?: 'default' | 'readonly' | 'required';
  validate?: boolean;
  lookup?: string;
  lookupKeyMap?: string[][];
  menuType?: string;
}

export interface IWidgetDetail {
  label?: string;
}

export interface IWidgetData {
  type: string;
  parentId?: string;
  external?: boolean;
  id?: string;
  icon?: any;
  title?: string;
  selected?: boolean;
  children?: any[];
  detail: ICanvasDetail | IButtonGroupDetail | ICheckboxDetail | IComboboxDetail | IDatasrcDetail | IDialogDetail
    | IHyperlinkDetail | IImageDetail | IMultilineTextboxDetail | IPushButtonDetail | IRadioButtonDetail | IRadioButtonGroupDetail
    | ISectionColDetail | ISectionRowDetail | ISectionDetail | IStaticTextDetail | ITabDetail | ITabGroupDetail | IMultipartTextboxDetail
    | ITableColDetail | ITableDetail | ITextboxDetail | IAppButtonDetail | IAppActionDetail | IAttachmentsDetail | ICustomDetail | IMenuItemDetail;
}

export interface IWidgetProps {
  widget: IWidgetData
}

export interface IPagination {
  pageSize?: number;
  currentPage?: number;
}

export interface IQueryParams {
  widgetId?: string;
  modelName?: string;
  pagination?: IPagination;
  filter?: any;
  sorter?: any;
  value?: any;
  objName?: string;
  targetId?: string;
  rows?: any[];
  eventValue?: string;
  appKey?: string;
}

export interface IAppTableSelectedRow {
  [key: string]: any[];
}

export interface IAppBean {
  name?: string;
  parent?: IAppBean|undefined;
  buttons?: IWidgetData[];
  actions?: IWidgetData[];
  updateWidgets: (widgets?:IWidgetData[],updateLibrary?:boolean) => void;
  initLIBRARY: (widgets:IWidgetData[]) => void;
  initMENUS: (widgets:IWidgetData[]) => void;
  initLOOKUPS: (widgets:IWidgetData[]) => void;
  getMENUS: (menuId:string) => IWidgetData[];
  getAppButtons: () => IWidgetData[];
  getAppActions: () => IWidgetData[];
  getModelName: () => string;
  getWidgets: () => IWidgetData[];
  getRootWidget: () => IWidgetData;
  needToSave: () => boolean;
  getValidation: () => (...args: any[]) => Promise<void>|undefined;
  getItem: () => any;
  getTableSelectedRows: (tableId:string) => any[];
  emit: (event: string, ...args: any[]) => boolean;
  on: (event: string, fn: (...args:any[])=>void, context?: any) => this;
  off: (event: string, fn: (...args:any[])=>void, context?: any, once?: boolean) => this;
}

export interface IRendererPlugin {
  [key: string]: any;
}
