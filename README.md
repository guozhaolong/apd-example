## App Designer Renderer By AntDesign

## Demo
```
  const plugins = {
    "custom.js": React.lazy(() => import('./custom') )
  };

  const demoData = [
    { type: 'canvas', id: 'workorder', title: '画布', detail: {modelName:'workorder'} },
      { type: 'tabgroup', parentId: 'workorder', id: 'canvas_tabgroup1', title: '标签组', detail: { isMain:true }},
      { type: 'tab', parentId: 'canvas_tabgroup1', id: 'canvas_tabgroup1_tab1', title: '标签', detail: { label: '列表',type:'list'}},
      { type: 'custom', parentId: 'canvas_tabgroup1_tab1', id: 'canvas_custom1', title: '自定义', detail: { fileName:'custom.js'} },
      { type: 'table', parentId: 'canvas_tabgroup1_tab1', id: 'canvas_tabgroup1_tab1_table1', title: '表格',
        detail: { label: '',isMain: true,width:1400,bordered:true }},
      { type: 'tablecol', parentId: 'canvas_tabgroup1_tab1_table1', id: 'canvas_tabgroup1_tab1_table1_col1', title: '表格列',
        detail: { label: '工单编号',dataAttribute:'woNum',event:'selectRecord',width: 400}},
      { type: 'tablecol', parentId: 'canvas_tabgroup1_tab1_table1', id: 'canvas_tabgroup1_tab1_table1_col2', title: '表格列',
        detail: { label: '工单描述',dataAttribute:'desc',width: 400}}
  ];
  
  const library = [
    { type: 'dialog', id: 'selectEQ', title: '对话框', detail: { label: '选择装备', width: 600}},
    { type: 'table', parentId: 'selectEQ', id: 'canvas_dialog1_table_EQ', title: '表格',
      detail: { label: '',dataSrc: 'canvas_datasrc1',pageSize:5, selectMode:'multiple',inputMode: 'readonly'}},
    { type: 'tablecol', parentId: 'canvas_dialog1_table_EQ', id: 'canvas_dialog1_table_EQ_col1', title: '表格列',
      detail: { label: '装备编号',dataAttribute:'eqNum'}},
    { type: 'tablecol', parentId: 'canvas_dialog1_table_EQ', id: 'canvas_dialog1_table_EQ_col2', title: '表格列',
      detail: { label: '装备描述',dataAttribute:'desc'}},
    { type: 'pushbutton', title: '按钮', id: 'canvas_dialog1_btn1', parentId: 'selectEQ',
      detail: { label: '确定',isDefault: true,event: 'dialogOk' }},
    { type: 'pushbutton', title: '按钮', id: 'canvas_dialog1_btn2', parentId: 'selectEQ',
      detail: { label: '取消',event: 'dialogClose' }},
  ];
  
  const lookups = [
    { type: 'table', id: 'selectEQ1', title: '表格',detail: { pageSize:5,inputMode: 'readonly'}},
    { type: 'tablecol', parentId: 'selectEQ1', id: 'canvas_dialog2_table_EQ_col1', title: '表格列',
      detail: { label: '装备编号',dataAttribute:'eqNum',event:'toggleLOOKUPS'}},
    { type: 'tablecol', parentId: 'selectEQ1', id: 'canvas_dialog2_table_EQ_col2', title: '表格列',
      detail: { label: '装备描述',dataAttribute:'desc'}},
    
    { type: 'table', id: 'selectEQ2', title: '表格',detail: { pageSize:5,inputMode: 'readonly'}},
    { type: 'tablecol', parentId: 'selectEQ2', id: 'canvas_dialog2_table_EQ2_col1', title: '表格列',
      detail: { label: '装备编号',dataAttribute:'eqNum',event:'toggleLOOKUPS'}},
    { type: 'tablecol', parentId: 'selectEQ2', id: 'canvas_dialog2_table_EQ2_col2', title: '表格列',
      detail: { label: '装备描述',dataAttribute:'desc'}},
    { type: 'tablecol', parentId: 'selectEQ2', id: 'canvas_dialog2_table_EQ2_col3', title: '表格列',
      detail: { label: '状态',dataAttribute:'status'}},
  ];
  
  const AppDemo = () => {
    const model = useMemo(()=> new AppBean(demoData),[]);
    model.initLIBRARY(library);
    model.initLOOKUPS(lookups);
    return (
      <AppRenderer model={model} plugins={plugins}/>
    );
  };
```

## API
### AppBean
#### 属性
| 名称 | 描述 | 类型 | 默认值 |
|:---|:---|:---:|:---:|
| buttons | 应用主按钮 | IWidgetData[] | [ ] |
| actions | 应用更多操作按钮内容 | IAppAction[] | [ ] |
| widgets | 应用控件集合 | IWidgetData[] | [ ] |
| LIBRARY | 公用控件集合 | IWidgetData[] | [ ] |
| MENUS | 公用菜单集合 | IWidgetData[] | [ ] |
| [LOOKUPS](#LOOKUPS) | 公用查找框集合 | IWidgetData[] | [ ] |
| rootWidget | 应用根控件(type='canvas') | IWidgetData | {type:'canvas',detail:{}} |
| items | 应用主数据集合 | any[] | [] |
| item | 应用当前选择的主数据 | any | {} |
| total | 应用主数据总条数 | number | 0 |
| modelName | 应用主模块名称 | string | '' |
| data | 应用当前选择主数据的变更数据 | any | {} |
| tabId | 应用当前显示的标签栏ID | string | '' |
| tableSelectedRow | 应用所有表格的选择行存储对象 | IAppTableSelectedRow | {} |

#### 事件
| 名称 | 描述 | 参数 | 回调事件 |
|:---|:---|:---:|:---:|
| find | 查找主应用数据集合 |  | $modelName:find:$tableId |
| findByQuery | 查找指定应用数据集合 | fields | $modelName:findByQuery:$tableId |
| findOne | 查找主应用具体一条数据(value为id值) |  | $modelName:findOne、itemUpdated |
| findByTable | 查找具体一个表格的数据 |  | $modelName:find:$tableId |
| findByDialog | 查找Dialog下的数据 |  | $modelName:findByDialog:$dialogId |
| findByTab | 查找主应用某个标签下的数据 |  | $modelName:findOne、itemUpdated |
| findList | 查找下拉框数据集合 |  | $modelName:findList:$comboboxId |
| findTree | 查找树数据集合 |  | $modelName:findTree:$treeId |
| selectRecord | 主应用选择一条数据(value为选择的record对象) |  | findOne、changeAppTab |
| dialogOpen | 打开弹出框(eventValue为dialogId) |  | widgetsUpdated |
| dialogOk | 弹出框确定(targetId为目标控件ID) |  | widgetsUpdated |
| dialogClose | 打开弹出框(eventValue为dialogId) |  | widgetsUpdated |
| changeDataByForm | 更新主应用选择数据的属性 |  | |
| changeDataByTable | 更新主应用选择数据的子表数据 |  |  |
| selectTableRows | 更新一个表格的选择行数据(widgetId为表格控件ID) | | $modelName:selectedRows:$tableId |
| showLOOKUPS | 弹出一个查找表格框 | widgetId,lookupId | afterShowLOOKUPS |
| fetchLOOKUPS | 刷新一个查找表格框的数据 | widgetId,lookupId | afterFetchLOOKUPS |
| toggleLOOKUPS | 表格点击一列回填到主应用文本框 | widgetId,record | setValue,afterHideLOOKUPS |
| insert | 主应用添加一条数据 | {} |  |
| save | 主应用保存数据 | {} |  |
| duplicate | 主应用复制一条数据 | {} |  |
| previous | 主应用翻到上一条数据 | {} |  |
| next | 主应用翻到下一条数据 | {} |  |
| routeWF | 主应用发送工作流 | {} |  |
| searchMore | 主应用弹出高级搜索对话框 | {} |  |
| bookmark | 主应用列表设置书签 | {} |  |
| reset | 主应用重置数据 | {} |  |
| itemUpdated | 更新主应用数据 | item:any |  |
| widgetsUpdated | 更新控件 | widgets:IWidgetData[] |  |
| setValue | 设置主应用当前选择数据值 | values:any |  |
| changeAppTab | 设置主应用按钮是否可点 | tab:IWidgetData |  |
| setAppBtnDisabled:$AppBtnId | 设置主应用按钮是否可点 | flag:boolean |  |

#### 回调事件 
> 以 modelName:eventName:widgetId 形式表示, modelName代表触发该事件的模块名默认为主应用模块,widgetId代表触发该事件的控件ID

| 名称 | 描述 | 参数 | 源组件 |
|:---|:---|:---:|:---:|
| find | 刷新table数据 | items,total | Table |
| findByQuery | 用于在自定义组件中的定制查询 | items,total | Custom |
| findByDialog | 更新Dialog的item数据 | item | Dialog,Table |
| selectedRows | 选择table数据 | rows | Table |
| updatedRows | 更新table数据 | rows | Table |
| findOne | 刷新主应用item数据 | item | TabGroup |
| findList | 刷新下拉框数据 | items,total | Combobox |
| findTree | 刷新树形数据 | items | Tree |

#### 方法
| 名称 | 描述 | 参数 | 返回值 |
|:---|:---|:---:|:---:|
| updateWidgets | 更新控件集 | widgets:IWidgetData[],updateLibrary:boolean | 无 |
| [initLOOKUPS](#LOOKUPS) | 更新查找框控件集 | widgets:IWidgetData[] | 无 |
| initMENUS | 更新下拉菜单控件集 | widgets:IWidgetData[] | 无 |
| getMENUS | 获取指定id的菜单控件及其子级 | menuId:string | IWidgetData[] |
| initLIBRARY | 更新公用控件集 | widgets:IWidgetData[] | 无 |
| getWidgets | 获取全部控件 | 无 | 无 |
| getRootWidget | 获取画布根控件 | 无 | 无 |
| getModelName | 获取主应用ModelName | 无 | 无 |
| getTableSelectedRows | 获取一个表格的选择行集合 | tableId | 无 |
| getItem | 获取主应用选择的单条数据 | 无 | any |
| getAppButtons | 获取主应用按钮 | 无 | IWidgetData[] |
| getAppActions | 获取主应用ModelName | 无 | IAppAction[] |
| [getValidation](#Validation) | 获取字段验证函数 | 无 | (...args: any[])=>Promise 或 undefined |


### Plugins
```
const plugins = {
  "xxxx": React.lazy(() => import('./xxx/xxx') ),
  "xxxxx": React.lazy(() => import('./xx/xxxx/xxx') )
};
<AppRenderer model={model} plugins={plugins}/>
```
> plugins属性名对应custom控件的fileName属性,属性值为懒加载的React组件,组件的props会自动注入model和widget属性

### LOOKUPS
#### 配置lookup.js
```
const lookups = [
  { type: 'table', id: 'selectEQ', title: '表格',detail: { pageSize:5,inputMode: 'readonly'}},
  { type: 'tablecol', parentId: 'selectEQ1', id: 'canvas_dialog2_table_EQ_col1', title: '表格列',
    detail: { label: '装备编号',dataAttribute:'eqNum',event:'toggleLOOKUPS'}},
  { type: 'tablecol', parentId: 'selectEQ1', id: 'canvas_dialog2_table_EQ_col2', title: '表格列',
    detail: { label: '装备描述',dataAttribute:'desc'}},

  { type: 'table', id: 'selectWO', title: '表格',detail: { pageSize:5,inputMode: 'readonly',width: 800}},
    { type: 'tablecol', parentId: 'selectWO', id: 'canvas_dialog2_table_WO_col1', title: '表格列',
      detail: { label: '工单编号',dataAttribute:'woNum',event:'toggleLOOKUPS'}},
    { type: 'tablecol', parentId: 'selectWO', id: 'canvas_dialog2_table_WO_col2', title: '表格列',
      detail: { label: '工单描述',dataAttribute:'desc'}},
    { type: 'tablecol', parentId: 'selectWO', id: 'canvas_dialog2_table_WO_col3', title: '表格列',
      detail: { label: '状态',dataAttribute:'status'}},
    { type: 'tablecol', parentId: 'selectWO', id: 'canvas_dialog2_table_WO_col4', title: '表格列',
      detail: { label: '创建时间',dataAttribute:'created_time'}}
];
```
#### 通过AppBean构造函数或initLOOKUPS方法加载
```
const demoData = [
  ...
  { type: 'textbox', parentId: 'canvas_tabgroup1_tab2_row1_col2', id: 'canvas_tabgroup1_tab2_row1_col2_text1', title: '文本框',
     detail: {label:'主要装备',dataAttribute: 'eqNum', lookup: 'selectEQ', lookupKeyMap: [['eqNum','desc'],['eqNum','desc']]}},
  ...
];
const model = useMemo(()=> new AppBean(demoData),[]);
model.initLOOKUPS(lookups);
```
> 文本框、多部分文本、多行文本、表格列都可以配置lookup属性，配置了该属性后控件右侧会出现放大镜按钮
> 点击按钮弹出在LOOKUPS.js中配置的table，id对应lookup属性名，
> lookupKeyMap为二维数组，第一个数组为要赋值的源属性，第二个数组为table中包含的属性

### Validation
``` 
  public getValidation(){
    return async (_rule, value, fieldName, record, _form) => {
      const response = await AppBean.validate({ ...record, [fieldName]: value }); // 远程请求
      if(response){
        const { status,message } = response;
        if(status === 2)
          return Promise.reject(message); // 输入值无效
        else
          return Promise.resolve(); // 输入值有效
      }
      else
        return Promise.resolve();
    }
  }
```
> 通过覆盖getValidation方法完成页面属性的校验，当该属性detail的validate为true时生效
