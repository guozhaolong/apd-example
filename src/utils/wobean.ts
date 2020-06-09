import AppBean from "./appbean";

export default class WOBean extends AppBean {
  public name = '工单';
  public buttons = [
    { type: 'appbutton', id: 'workorder_addBtn', detail: { label: '新增',event:'insert',icon:'plus',visible: ['list','insert'] }},
    { type: 'appbutton', id: 'workorder_prevBtn', detail: { label: '上一条',event:'previous',icon:'left',visible:'insert' }},
    { type: 'appbutton', id: 'workorder_nextBtn', detail: { label: '下一条',event:'next',icon:'right',visible:'insert' }},
    { type: 'appbutton', id: 'workorder_saveBtn', detail: { label: '保存',event:'save',icon:'save',visible:'insert' }},
    { type: 'appbutton', id: 'workorder_routeWFBtn', detail: { label: '发送工作流',event:'routeWF',icon:'partition',visible:'insert' }},
  ];
  public actions = [

  ];

}
