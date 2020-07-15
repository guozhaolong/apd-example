import React, {useEffect, useState} from 'react';
import { Form,Input,Button,Select } from 'antd';

const Custom = ({model,widget,form}) => {
  const modelName = 'person';
  const widgetId = widget.id;
  const [ownerOptions,setOwnerOptions] = useState([]);
  const handleSearch = ()=>{
    const mainTable = model.getWidgets().find(w => w.type === 'table' && w.detail.isMain);
    if(mainTable)
      model.emit('find',{widgetId:mainTable.id,filter:form.getFieldsValue()});
  };
  const handleReset = ()=>{
    form.resetFields();
    handleSearch();
  };
  useEffect(()=>{
    model.on(`${modelName}:findByQuery:${widgetId}`,({items})=>{
      setOwnerOptions(items);
    });
    model.emit('findByQuery',{widgetId,modelName,fields:['personID','name']});
  },[]);
  return (
    <div style={{display:'flex',paddingBottom:8,alignItems:'center'}}>
      <Form.Item name="woNum" label="工单编号">
        <Input />
      </Form.Item>
      <Form.Item name="owner.personID" label="所有者">
        <Select style={{width:160}} allowClear>
          {
            ownerOptions.map(o => (<Select.Option key={o.id} value={o.personID}>{o.name}</Select.Option>))
          }
        </Select>
      </Form.Item>
      <Button size="small" style={{lineHeight:'unset',marginRight:8}} onClick={handleReset}>重置</Button>
      <Button size="small" type="primary" style={{lineHeight:'unset'}} onClick={handleSearch}>查询</Button>
    </div>
  );
};

export default Custom;
