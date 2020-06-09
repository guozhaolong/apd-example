export default [
  { type: 'menu', id: 'EQ',},
  { type: 'menuitem', parentId: 'EQ', id: 'eq_menuitem1', detail: { label: '转到装备',event:'appLink',eventValue:'equipment', appKey: 'eqNum',icon:'rotateRight'}},
  { type: 'menuitem', parentId: 'EQ', id: 'eq_menuitem2', detail: { label: '查看父级装备',event:'viewEQParent',icon:'container'}},
  { type: 'menuitem', parentId: 'EQ', id: 'eq_menuitem3', detail: { label: '查看分类结构',event:'viewEQClassification',icon:'cluster'}},

  { type: 'menu', id: 'WO',},
  { type: 'menuitem', parentId: 'WO', id: 'wo_menuitem1', detail: { label: '转到工单',event:'appLink',eventValue:'workorder', appKey: 'woNum', icon:'rotateRight'}},

  { type: 'menu', id: 'PERSON',},
  { type: 'menuitem', parentId: 'PERSON', id: 'person_menuitem1', detail: { label: '查看头像',event:'viewAvatar',icon:'idCard'}},
  { type: 'menuitem', parentId: 'PERSON', id: 'person_menuitem2', detail: { label: '查看电话',event:'viewAvatar',icon:'phone'}},
  { type: 'menuitem', parentId: 'PERSON', id: 'person_menuitem3', detail: { label: '查看邮件',event:'viewAvatar',icon:'mail'}},
];
