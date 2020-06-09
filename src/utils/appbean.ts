import EE from 'eventemitter3';
// import { extend } from 'umi-request';
import { extend } from './simulator';
import _ from 'lodash';
import {
  IAppBean,
  IWidgetData,
  IWidgetDataDetail,
  ICanvasDetail,
  IDatasrcDetail,
  ITabDetail,
  IDialogDetail,
  ITabGroupDetail,
  IComboboxDetail,
  ITableDetail,
  IAppTableSelectedRow,
  IQueryParams, ITreeDetail, ITableColDetail,
} from '../../typings';

export default class AppBean extends EE implements IAppBean{

  public buttons = [
    { type: 'appbutton', id: 'workorder_addBtn', detail: { label: '新增',event:'insert',icon:'plus',visible: ['list','insert'] }},
    { type: 'appbutton', id: 'workorder_prevBtn', detail: { label: '上一条',event:'previous',icon:'left',visible:'insert' }},
    { type: 'appbutton', id: 'workorder_nextBtn', detail: { label: '下一条',event:'next',icon:'right',visible:'insert' }},
    { type: 'appbutton', id: 'workorder_saveBtn', detail: { label: '保存',event:'save',icon:'save',visible:'insert' }},
    { type: 'appbutton', id: 'workorder_routeWFBtn', detail: { label: '发送工作流',event:'routeWF',icon:'partition',visible:'insert' }},
  ];

  public actions = [
    {type:'appaction', id: 'action1', detail: {event: 'action1', label: '操作一'}},
    {type:'appaction', id: 'action2', detail: {event: 'action2', label: '操作二'}},
    {type:'appaction', id: 'action3', detail: {event: 'action3', label: '操作三'}},
  ];

  public name:string = "";

  public parent:IAppBean;

  private widgets:IWidgetData[] = [];

  private LIBRARY:IWidgetData[] = [];

  private MENUS:IWidgetData[] = [];

  private LOOKUPS:IWidgetData[] = [];

  private rootWidget:IWidgetData = {type:'canvas',detail:{}};

  private item:any = {};

  private modelName:string = '';

  private data:any = {};

  private tableSelectedRow:IAppTableSelectedRow = {};

  public constructor(widgets:IWidgetData[],library?:IWidgetData[],lookups?:IWidgetData[],menus?:IWidgetData[]) {
    super();
    if(library)
      this.LIBRARY = library;
    if(lookups)
      this.LOOKUPS = lookups;
    if(menus)
      this.MENUS = menus;
    this.updateWidgets(widgets,true);
    this.initEvents();
  }

  private initEvents(){
    this.on('find',this.find);
    this.on('findByQuery',this.findByQuery);
    this.on('findOne',this.findOne);
    this.on('selectRecord',this.selectRecord);
    this.on('findByTab',this.findByTab);
    this.on('findByTable',this.findByTable);
    this.on('findByDialog',this.findByDialog);
    this.on('dialogOpen',this.dialogOpen);
    this.on('dialogClose',this.dialogClose);
    this.on('dialogOk',this.dialogOk);
    this.on('findList',this.findList);
    this.on('findTree',this.findTree);
    this.on('changeDataByForm',this.changeDataByForm);
    this.on('changeDataByTable',this.changeDataByTable);
    this.on('selectTableRows',this.selectTableRows);
    this.on('searchMore',this.searchMore);
    this.on('bookmark',this.bookmark);
    this.on('insert',this.insert);
    this.on('save',this.save);
    this.on('duplicate',this.duplicate);
    this.on('previous',this.previous);
    this.on('next',this.next);
    this.on('routeWF',this.routeWF);
    this.on('showLOOKUPS',this.showLOOKUPS);
    this.on('fetchLOOKUPS',this.fetchLOOKUPS);
    this.on('toggleLOOKUPS',this.toggleLOOKUPS);
    this.on('appLink',this.appLink);
    this.on('appLinkReturn',this.appLinkReturn);
    this.on('appLinkReturnWithValue',this.appLinkReturnWithValue);
    this.on('reset',this.reset);
  }

  public initLIBRARY(widgets:IWidgetData[]){
    this.LIBRARY = widgets;
    this.updateWidgets(undefined,true);
  }

  public initMENUS(widgets:IWidgetData[]){
    this.MENUS = widgets;
  }

  public initLOOKUPS(widgets:IWidgetData[]){
    this.LOOKUPS = widgets;
  }

  public updateWidgets(widgets?:IWidgetData[],updateLibrary?:boolean){
    const libWidgets = this.LIBRARY.map(w => {
      if(!w.parentId){
        return {
          ...w,
          parentId: this.rootWidget.id,
          external: true,
        }
      }
      return {
        ...w,
        external: true,
      };
    });
    if(widgets) {
      if(updateLibrary)
        this.widgets = [...widgets.filter(w => !w.external), ...libWidgets];
      else
        this.widgets = widgets;
    }else{
      this.widgets = [...this.widgets.filter(w => !w.external), ...libWidgets];
    }
    const canvasWidgets = this.widgets.filter(d => d.type === 'canvas');
    const widget = canvasWidgets[0] || {};
    this.rootWidget =  widget;
    const {detail = {}} = widget;
    this.modelName = (detail as ICanvasDetail).modelName;
    this.emit(`widgetsUpdated`,this.widgets);
  }

  public getAppButtons(){
    return this.buttons;
  }

  public getAppActions(){
    return this.actions;
  }

  public getWidgets(){
    return this.widgets;
  }

  public getModelName(){
    return this.modelName;
  }

  public getRootWidget(){
    return this.rootWidget;
  }

  public needToSave(){
    return !_.isEmpty(this.data);
  }

  public getTableSelectedRows(widgetId){
    if(this.tableSelectedRow[widgetId])
      return this.tableSelectedRow[widgetId];
    else
      return [];
  }

  public getMENUS(menuId:string){
    const menu = this.MENUS.find(m => m.id === menuId);
    if(menu) {
      return this.MENUS.filter(m => m.parentId === menuId);
    }else{
      return [];
    }
  }

  public getValidation(){
    return async (_rule, value, fieldName, record, _form) => {
      const response = await AppBean.validate({ ...record, [fieldName]: value });
      if(response){
        const { status,message } = response;
        if(status === 2)
          return Promise.reject(message);
        else
          return Promise.resolve();
      }
      else
        return Promise.resolve();
    }
  }

  public getItem(){
    return this.item;
  }

  private setItem(payload){
    this.item = {...this.item,...payload};
    this.emit(`itemUpdated`,this.item);
  }

  private resetItem(payload){
    this.item = payload;
    this.emit(`itemUpdated`,this.item);
  }

  private appendDataAttribute(array:any[],child?:string){
    const attr = array.shift();
    if(_.isEmpty(array)) {
      if(child)
        return `
          ${attr} {
            ${child}
          }
        `;
      else
        return `
          ${attr}
        `;
    }
    return `
      ${attr}{
        ${this.appendDataAttribute(array,child)}
      }
    `
  }

  private appendGQL(widget:IWidgetData,widgets:IWidgetData[]){
    const { detail = {} } = widget;
    const { dataAttribute,objName } = detail as IWidgetDataDetail;
    const children = widgets.filter(w => w.parentId === widget.id);
    if(widget.type === 'table'){
      if(objName){
        let attr = objName.split('.');
        return this.appendDataAttribute(attr,
          `
            list{
              id
              ${children.map(child => this.appendGQL(child,widgets)).filter(child => !!child).join('\n')}
            }
            count
        `);
      }
      return `
        list{
          id
          ${children.map(child => this.appendGQL(child,widgets)).filter(child => !!child).join('\n')}
        }
        count
      `;
    }else if(widget.type === 'tabgroup'){
      let tab = children.find(child => (child.detail as ITabDetail).visible);
      if(!tab){
        tab = children[0];
      }
      return this.appendGQL(tab,widgets)
    }else if(dataAttribute){
      let attr = dataAttribute;
      if(attr.indexOf('.') > 0){
        attr = this.appendDataAttribute(attr.split('.'));
      }
      if(widget.type === 'combobox'){ // 临时增加下拉框数据取值
        const { listAttribute, keyAttribute, displayAttribute } = detail as IComboboxDetail;
        attr += `\n
          ${listAttribute} {
            list{
              id
              ${keyAttribute}
              ${displayAttribute}
            }
          }
        `;
      }
      return `
        ${attr}
        ${children.map(child => this.appendGQL(child,widgets)).filter(child => !!child).join('\n')}
      `;
    }else if(objName){
      let attr = objName.split('.');
      return this.appendDataAttribute(attr,
        `
            id
            ${children.map(child => this.appendGQL(child,widgets)).filter(child => !!child).join('\n')}
        `);
    }else if(!_.isEmpty(children)) {
      return children.map(child => this.appendGQL(child,widgets)).filter(child => !!child).join('\n');
    }else if(widget.type === 'combobox'){ // 防止没有配置dataAttribute的combobox不生成下拉数据查询
      const { listAttribute, keyAttribute, displayAttribute } = detail as IComboboxDetail;
      return `\n
        ${listAttribute} {
          list{
            id
            ${keyAttribute}
            ${displayAttribute}
          }
        }
      `;
    }else if(widget.type === 'tree'){
      const { treeAttribute, keyAttribute, displayAttribute } = detail as ITreeDetail;
      return `\n
        ${treeAttribute} {
          list{
            id
            parent
            ${keyAttribute}
            ${displayAttribute}
          }
        }
      `;
    }else if(widget.type === 'attachments'){
      return `\n
        docLinks {
          list {
            id
            name
            filename
            url
            created_by {
              id
              name
            }
            created_time
          }
          count
        }
      `;
    }else {
      return undefined;
    }
  }

  private getGQL(widgetId:string|undefined){
    const widget = this.widgets.find(w => w.id === widgetId)!;
    const gql = this.appendGQL(widget,this.widgets);
    if(widget.type === 'table'){
      const {isMain,dataSrc,objName} = widget.detail as IWidgetDataDetail;
      if(isMain){
        return `
          query Find($app: String!, $pagination: Pagination, $sorter: [SortItem!]){
            ${this.modelName}_find (app: $app, pagination: $pagination, sorter: $sorter){
              ${gql}
            }
          }
        `
      }else if(dataSrc){
        const ds = this.widgets.find(w => w.type === 'datasrc' && w.id === dataSrc)!;
        const { modelName } = ds.detail as IDatasrcDetail;
        return `
          query Find($app: String!, $pagination: Pagination, $sorter: [SortItem!]){
            ${modelName}_find (app: $app, pagination: $pagination, sorter: $sorter){
              ${gql}
            }
          }
        `
      }else if(objName){
        return `
          query Find($app: String!, $id: ID!){
            ${this.modelName}_findOne (app: $app, id: $id){
              id
              ${gql}
            }
          }
        `;
      }else{
        const parentDialog = this.getParentByType(widget.id,'dialog');
        const { modelName } = parentDialog.detail as IDialogDetail;
        return `
          query Find($app: String!, $pagination: Pagination, $sorter: [SortItem!]){
            ${modelName}_find (app: $app, pagination: $pagination, sorter: $sorter){
              ${gql}
            }
          }
        `
      }
    }else if(widget.type === 'tab'){
      return `
        query Find($app: String!, $id: ID!){
          ${this.modelName}_findOne (app: $app, id: $id){
            id
            ${gql}
          }
        }
      `;
    }else if(widget.type === 'dialog'){
      return `
        query Find($app: String!, $id: ID!){
          ${this.modelName}_findOne (app: $app, id: $id){
            id
            ${gql}
          }
        }
      `;
    }else if(widget.type === 'attachments'){
      return `
          query Find($app: String!, $id: ID!){
            ${this.modelName}_findOne (app: $app, id: $id){
              id
              docLinks {
                list {
                  id
                  name
                  filename
                  url
                  created_by {
                    id
                    name
                  }
                  created_time
                }
                count
              }
            }
          }
        `;
    }
  }

  private async find(params:IQueryParams) {
    const { widgetId, modelName = this.modelName, pagination, filter } = params;
    const gql = this.getGQL(widgetId);
    const response = await AppBean.query(gql, {
      app: modelName,
      pagination: pagination || { currentPage: 1, pageSize: 10 },
      where: filter,
    });
    if(!response || !response.data || !response.data[`${modelName}_find`]){
      this.emit(`${modelName}:find:${widgetId}`,{
        items: [],
        total: 0,
      });
      return;
    }
    this.emit(`${modelName}:find:${widgetId}`,{
      items: response.data[`${modelName}_find`].list,
      total: response.data[`${modelName}_find`].count,
    });
  }

  private async findByQuery(params) {
    const { fields = [],widgetId, modelName = this.modelName,pagination, } = params;
    const gql = `
        query Find($app: String!, $pagination: Pagination, $sorter: [SortItem!]){
          ${modelName}_find (app: $app, pagination: $pagination, sorter: $sorter){
            list{
              id
              ${fields.join("\n")}
            }
            count
          }
        }
      `;
    const response = await AppBean.query(gql, {
      app: modelName,
      pagination: pagination || { currentPage: 1, pageSize: 10 },
    });
    if(!response || !response.data || !response.data[`${modelName}_find`]){
      this.emit(`${modelName}:findByQuery:${widgetId}`,{
        items: [],
        total: 0,
      });
      return;
    }
    this.emit(`${modelName}:findByQuery:${widgetId}`,{
      items: response.data[`${modelName}_find`].list,
      total: response.data[`${modelName}_find`].count,
    });
  }

  private async findOne(params:IQueryParams) {
    const { widgetId, modelName = this.modelName, value } = params;
    const gql = this.getGQL(widgetId);
    const response = await AppBean.query(gql, {
      app: modelName,
      id: value,
    });
    if(!value || !response || !response.data || !response.data[`${modelName}_findOne`]){
      this.emit(`${modelName}:findOne`,{
        item: {},
      });
      if(this.modelName === modelName)
        this.resetItem({});
    }else if(this.modelName === modelName){
      this.setItem(response.data[`${modelName}_findOne`]);
    }else {
      this.emit(`${modelName}:findOne`, {
        item: response.data[`${modelName}_findOne`],
      });
    }
  }

  private async findByTable(params:IQueryParams){
    const { widgetId, modelName = this.modelName, objName, pagination,filter } = params;
    const gql = this.getGQL(widgetId);
    const response = await AppBean.query(gql, {
      app: modelName,
      id: this.item.id,
      pagination: pagination || { currentPage: 1, pageSize: 5 },
      where: filter,
    });
    if(!response || !response.data || !response.data[`${modelName}_findOne`]){
      this.emit(`${modelName}:find:${widgetId}`,{
        items: [],
        total: 0,
      });
      return;
    }
    if(objName){
      const result = _.get(response.data[`${modelName}_findOne`],objName);
      if(result) {
        this.emit(`${modelName}:find:${widgetId}`, {
          items: result.list,
          total: result.count,
        });
      }
    }
  }

  private async findByDialog(params:IQueryParams){
    const { widgetId, modelName = this.modelName } = params;
    const widget = this.widgets.find(w => w.id === widgetId);
    const { dataSrc,modelName:dialogModel } = widget!.detail as IDialogDetail;
    if(dataSrc) {
      const srcWidget = this.widgets.find(w => w.id === dataSrc);
      if (srcWidget && srcWidget.type === 'table') {
        const rows = this.getTableSelectedRows(dataSrc);
        if (rows && _.isArray(rows) && rows.length > 0) {
          this.emit(`${modelName}:findByDialog:${widgetId}`, { item: rows[0] });
        }
      }
    } else {
      const gql = this.getGQL(widgetId);
      const response = await AppBean.query(gql, {
        app: modelName,
        id: this.item.id,
      });
      if(!response || !response.data || !response.data[`${modelName}_findOne`]) {
        this.emit(`${modelName}:findByDialog:${widgetId}`, { item: {}});
      }else {
        this.emit(`${modelName}:findByDialog:${widgetId}`, { item: response.data[`${modelName}_findOne`]});
      }
    }
  }

  private async findByTab(params:IQueryParams) {
    const { widgetId, modelName = this.modelName } = params;
    const gql = this.getGQL(widgetId);
    const response = await AppBean.query(gql, {
      app: modelName,
      id: this.item.id,
    });
    if(!this.item.id || !response || !response.data || !response.data[`${modelName}_findOne`]) {
      if(this.modelName === modelName)
        this.resetItem({});
    }else if(this.modelName === modelName){
      this.setItem(response.data[`${modelName}_findOne`]);
    }else {
      this.emit(`${modelName}:findOne`,{
        item: response.data[`${modelName}_findOne`],
      });
    }
    this.setTabVisible({widgetId});
  }

  private findList(params:IQueryParams) {
    const { modelName = this.modelName, widgetId, value } = params;
    const parent = this.getParentByType(widgetId,'table');
    let optionObj = _.get(this.item,value);
    if(parent){
      const row = this.getTableSelectedRows(parent.id)[0];
      optionObj = _.get(row,value);
    }
    let list:any[] = [];
    if(optionObj && optionObj.list)
      list = optionObj.list;
    this.emit(`${modelName}:findList:${widgetId}`,{
      items: list
    });
  }

  private findTree(params:IQueryParams) {
    const { modelName = this.modelName, widgetId, value } = params;
    const tree = this.widgets.find(w => w.id === widgetId);
    const { keyAttribute = "id", displayAttribute = "name" } = tree!.detail as ITreeDetail;
    const parent = this.getParentByType(widgetId,'table');
    let treeObj = _.get(this.item,value);
    if(parent){
      const row = this.getTableSelectedRows(parent.id)[0];
      treeObj = _.get(row,value);
    }
    let list:any[] = [];
    if(treeObj && treeObj.list)
      list = treeObj.list;
    const fillTree = (node,parentId,treeData) => {
      const children = treeData.filter(t => t.parent === node[keyAttribute]).map(child => fillTree(child,node.id,treeData));
      return {
        id: node.id,
        parent: parentId ? parentId : undefined,
        key: node[keyAttribute],
        title: node[displayAttribute],
        children: children && children.length > 0 ? children : undefined
      }
    };
    const treeData = list.filter(t => !t.parent || t.parent === '').map(root => fillTree(root,undefined,list));
    this.emit(`${modelName}:findTree:${widgetId}`,{
      items: treeData
    });
  }

  private selectRecord(params:IQueryParams){
    const { modelName = this.modelName,value:record } = params;
    const tabgroup = this.widgets.find(w => w.type === 'tabgroup' && (w.detail as ITabGroupDetail).isMain);
    if(tabgroup){
      const tab = this.widgets.find(w => w.type === 'tab' && w.parentId === tabgroup.id && (w.detail as ITabDetail).type === 'insert');
      if(tab) {
        this.emit('findOne',{ modelName,widgetId: tab.id,value: record.id });
        this.emit('changeAppTab', tab);
        this.data = {};
      }
    }
  }

  private dialogOpen(params:IQueryParams){
    const { eventValue:dialogId,widgetId } = params;
    const targetId = this.getTargetId(widgetId);
    const widgets = this.widgets.map(w => {
      if (w.type === 'dialog' && w.id === dialogId) {
        return {
          ...w,
          detail: {
            ...w.detail,
            visible: true,
            targetId,
          }
        };
      }
      return w;
    });
    this.updateWidgets(widgets);
  }

  private dialogOk(params:IQueryParams){
    const { widgetId,targetId } = params;
    const widget = this.widgets.find(w => w.id === targetId);
    if(widget){
      if(widget.type === 'table') {
        const { objName } = widget.detail as ITableDetail;
        const dialog = this.widgets.find(w => w.id === widgetId);
        if (objName && dialog) {
          const table = this.getFirstChildByType(dialog.id!,'table');
          if(table){
            const newRows = this.tableSelectedRow[table.id!].map(row => ({
              ...row as {},
              id: _.uniqueId('new_'),
              isNew: true,
              isUpdate: true
            }));
            this.emit(`${this.modelName}:updatedRows:${targetId}`, [...this.data[objName], ...newRows]);
          }
        }
      }
    }
    this.dialogClose(params);
  }

  private dialogClose(params:IQueryParams){
    const { eventValue: dialogId } = params;
    const widgets = this.widgets.map(w => {
      if (w.type === 'dialog' && w.id === dialogId) {
        return {
          ...w,
          detail: {
            ...w.detail,
            visible: false,
          }
        };
      }
      return w;
    });
    this.updateWidgets(widgets);
  }

  private changeDataByForm(param:any){
    this.data = _.merge(this.data,param)
  }

  private changeDataByTable(params:IQueryParams){
    const { widgetId,value } = params;
    if(!value || _.isEmpty(value))
      return;
    const parentPath:string[] = [];
    const table = this.widgets.find(w => w.id === widgetId);
    if(table!.type === 'table'){
      const { objName, dataSrc } = table!.detail as ITableDetail;
      const parentTable = this.getParentByType(widgetId,'table');
      if(dataSrc){
        const dataModel = this.widgets.find(d => d.id === dataSrc);
        if(dataModel && dataModel.type === 'datasrc'){
          const { modelName:modelName1 } = dataModel.detail as IDatasrcDetail;
          if(modelName1)
            parentPath.push(modelName1);
        }else if(dataModel && dataModel.type === 'table'){
          const { objName:objName1 } = dataModel.detail as IWidgetDataDetail;
          if(objName1)
            parentPath.push(objName1);
        }
      }else if(parentTable){
        const { objName:objName1 } = parentTable.detail as IWidgetDataDetail;
        const rows = this.tableSelectedRow[parentTable.id!];
        // 子表更新数据未解决
        if(objName1)
          parentPath.push(objName1);
      }
      if(objName){
        parentPath.push(objName);
      }
      if(parentPath.length > 0)
        this.data = { ...this.data,..._.set({},parentPath,value) }
    }else if(table!.type === 'attachments'){
      this.data = { ...this.data,...(_.set({},'docLinks',value)) }
    }
  }

  private selectTableRows(params:IQueryParams){
    const { rows,widgetId } = params;
    if(widgetId) {
      this.tableSelectedRow[widgetId] = rows!;
    }
    this.emit(`${this.modelName}:selectedRows:${widgetId}`, rows);
  }

  private async showLOOKUPS(params:IQueryParams){
    const { widgetId,eventValue } = params;
    const table = this.LOOKUPS.find(w => w.id === eventValue);
    const widget = this.widgets.find(w => w.id === widgetId);
    if(table){
      const tableCols = this.LOOKUPS.filter(w => w.parentId === table.id);
      this.emit(`afterShowLOOKUPS`,{
        table: {
          ...table,
          children: tableCols
        },
        widget
      });
    }
  }

  private async fetchLOOKUPS(params:IQueryParams){
    const { widgetId,eventValue,pagination } = params;
    const table = this.LOOKUPS.find(w => w.id === eventValue);
    const widget = this.widgets.find(w => w.id === widgetId);
    const { dataAttribute,lookupKeyMap = [[],[]] } = widget!.detail as IWidgetDataDetail;
    const parentTable = this.getParentByType(widgetId,'table');
    if(dataAttribute && table){
      const { whereClause } = table.detail as ITableDetail;
      const tableCols = this.LOOKUPS.filter(w => w.parentId === table.id);
      const targetAttr = lookupKeyMap[1];
      const attrGQL = _.union(targetAttr,tableCols.map(t => {
        const { dataAttribute } = t.detail as ITableColDetail;
        if(dataAttribute) {
          let attr = dataAttribute;
          if (attr.indexOf('.') > 0) {
            attr = this.appendDataAttribute(attr.split('.'));
          }
          return attr;
        }
        return '';
      }).filter(t => t !== '')).join("\n");
      let attrName = dataAttribute+"Select";
      if (dataAttribute.indexOf('.') > 0) {
        attrName = dataAttribute.substr(0, dataAttribute.lastIndexOf('.')) + "Select";
      }
      let gql = '';
      if(parentTable){
        const { objName } = parentTable.detail as ITableDetail;
        gql = `
          query Find($app: String!, $id: ID!,$pagination: Pagination, $sorter: [SortItem!]){
            ${this.modelName}_findOne (app: $app, id: $id){
              ${objName}(pagination: $pagination, sorter: $sorter){
                one {
                  id
                  ${attrName}(pagination: $pagination, sorter: $sorter){
                    list {
                      id
                      ${attrGQL}
                    }
                    count
                  }
                }
              }
            }
          }
        `;
        attrName = objName+".one."+attrName;
      } else {
        gql = `
          query Find($app: String!, $id: ID!,$pagination: Pagination, $sorter: [SortItem!]){
            ${this.modelName}_findOne (app: $app, id: $id){
              ${attrName}(pagination: $pagination, sorter: $sorter){
                list {
                  id
                  ${attrGQL}
                }
                count
              }
            }
          }
        `;
      }
      const response = await AppBean.query(gql, {
        app: this.modelName,
        id: this.item.id,
        pagination: pagination || { currentPage: 1, pageSize: 10 },
        where: whereClause,
      });
      if(!response || !response.data || !response.data[`${this.modelName}_findOne`]){
        this.emit(`afterFetchLOOKUPS`,{
          items: [],
          total: 0,
        });
        return;
      }
      const result = _.get(response.data[`${this.modelName}_findOne`],attrName);
      this.emit(`afterFetchLOOKUPS`,{
        items: result.list,
        total: result.count,
      });
    }
  }

  private toggleLOOKUPS(params:IQueryParams){
    const { value:record,targetId } = params;
    const widget = this.widgets.find(w => w.id === targetId);
    if(widget){
      const { dataAttribute,lookupKeyMap = [[],[]] } = widget.detail as IWidgetDataDetail;
      let prefix = '';
      if(dataAttribute && dataAttribute.indexOf('.') > 0){
        prefix = dataAttribute.substr(0,dataAttribute.lastIndexOf('.')+1);
      }
      const parentTable = this.getParentByType(widget.id,'table');
      if(parentTable){
        const rows = this.tableSelectedRow[parentTable.id];
        if(rows && rows.length > 0){
          let row = rows[0];
          for(let i=0;i<lookupKeyMap[0].length;i++){
            const sourceAttr = lookupKeyMap[0][i];
            const targetAttr = lookupKeyMap[1][i];
            const attrValue = _.get(record,targetAttr);
            row = _.set(row,prefix+sourceAttr,attrValue);
          }
          this.emit(`${this.modelName}:updatedRows:${parentTable.id}`, [row]);
        }
      } else {
        let values = {};
        for(let i=0;i<lookupKeyMap[0].length;i++){
          const sourceAttr = lookupKeyMap[0][i];
          const targetAttr = lookupKeyMap[1][i];
          const attrValue = _.get(record,targetAttr);
          values = _.set(values,prefix+sourceAttr,attrValue);
        }
        this.emit(`setValue`, values);
      }
    }
    this.emit(`afterHideLOOKUPS`);
  }

  private async appLink(params:IQueryParams){
    const { widgetId,eventValue,appKey } = params;
    const response = await AppBean.getAppJSON(eventValue);
    if(response){
      const bean = new AppBean(response);
      bean.name = eventValue === 'equipment' ? '装备' : '工单';
      bean.parent = this;
      bean.initLIBRARY(this.LIBRARY);
      bean.initLOOKUPS(this.LOOKUPS);
      bean.initMENUS(this.MENUS);
      const dataAttribute = this.getWidgetDataAttribute(widgetId);
      let id = undefined;
      if(dataAttribute)
        id = _.get(this.item,dataAttribute);
      const getRootBean = (b) => {
        if(b.parent)
          return getRootBean(b.parent);
        else
          return b;
      };
      const rootBean = getRootBean(this);
      rootBean.emit(`gotoApp`, { bean, value:{ id }, widgetId,appKey });
    }
  }

  private async appLinkReturn(params:IQueryParams){
    const { widgetId, value } = params;

  }

  private async appLinkReturnWithValue(params:IQueryParams){
    const { widgetId, value } = params;
    const dataAttribute = this.getWidgetDataAttribute(widgetId);
    if(dataAttribute) {
      this.emit(`setValue`, _.set({},dataAttribute,value));
    }
  }

  private duplicate(){

  }

  private insert(){
    this.selectRecord({value:{}});
  }

  private save(){
    console.log(this.data);
    this.emit(`reset`);
    this.emit(this.modelName + `:save`);
  }

  private reset(){
    this.data = {};
  }

  private previous(){

  }

  private next(){

  }

  private searchMore(){
    this.dialogOpen({eventValue:'searchMore',widgetId: this.rootWidget.id});
  }

  private bookmark(params){
    const { modelName = this.modelName,widgetId,value:record, eventValue:key } = params;
    const table = this.getParentByType(widgetId,'table');
    this.emit(`${modelName}:bookmark:${table.id}`, record[key]);
  }

  private findBookmark(params:IQueryParams){
    const { modelName = this.modelName } = params;

  }

  private routeWF(){

  }

  public static async query(params,variables) {
    return extend({credentials: 'include'})
    (`/api/graphql`, {
      method: 'POST',
      data: {query:params,variables},
    });
  }

  public static async validate(variables) {
    return extend({credentials: 'include'})
    (`/api/validate`, {
      method: 'POST',
      data: { variables },
    });
  }

  public static async getAppJSON(app) {
    return extend({credentials: 'include'})
    (`/api/getAppJSON`, {
      method: 'POST',
      data: { app },
    });
  }

  private setTabVisible(params:IQueryParams){
    const { widgetId } = params;
    const widget = this.widgets.find(w => w.id === widgetId)!;
    this.widgets = this.widgets.map(w => {
      if(w.type === 'tab' && w.id === widgetId){
        return {
          ...w,
          detail: {
            ...w.detail,
            visible:true,
          }
        };
      }else if(w.type === 'tab' && w.parentId === widget.parentId){
        return {
          ...w,
          detail: {
            ...w.detail,
            visible:false,
          }
        };
      }
      return w;
    });
  }

  private getTargetId(widgetId){
    if(!widgetId)
      return undefined;
    const widget = this.widgets.find(w => w.id === widgetId);
    if('dataSrc' in widget!.detail || 'objName' in widget!.detail || 'modelName' in widget!.detail || 'dataAttribute' in widget!.detail){
      return widget!.id;
    } else {
      const parent = this.widgets.find(w => w.id === widget!.parentId);
      if(parent){
        return this.getTargetId(parent.id);
      }else{
        return undefined;
      }
    }
  }

  private getParentByType(widgetId:string|undefined,type:string){
    const widget = this.widgets.find(w => w.id === widgetId);
    if(!widget)
      return undefined;
    if(type === widget!.type){
      return widget;
    } else {
      const parent = this.widgets.find(w => w.id === widget!.parentId);
      if(parent){
        return this.getParentByType(parent.id!,type);
      }else{
        return undefined;
      }
    }
  }

  private getFirstChildByType(widgetId:string,type:string):IWidgetData|undefined{
    const children = this.widgets.filter(w => w.parentId === widgetId);
    if(children){
      const child = children.find(c => c.type === type);
      if(child) {
        return child;
      } else {
        return children.map(c => (this.getFirstChildByType(c.id!,type))).reduce((acc,curr)=>acc ? acc : curr);
      }
    } else {
      return undefined;
    }
  }

  private getWidgetDataAttribute(widgetId:string|undefined):string|undefined{
    const widget = this.widgets.find(w => w.id === widgetId);
    if(widget){
      const { dataAttribute } = widget.detail as IWidgetDataDetail;
      if(dataAttribute){
        const parentTable = this.getParentByType(widgetId,'table');
        if(parentTable){
          const { objName } = parentTable.detail as ITableDetail;
          return objName + "." + dataAttribute;
        } else {
          return dataAttribute;
        }
      }
    }
    return undefined;
  }

}
