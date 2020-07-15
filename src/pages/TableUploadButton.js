import React, {useEffect, useState,useMemo} from 'react';
import { Upload, Input, Button, Select, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const TableUploadButton = ({model,widget}) => {
  const url = '/api/uploadFiles';
  const modelName = model.getModelName();
  const id = model.getCurrentId();
  const tableCtrl = model.getControlByParentId(widget.id);
  const uploadProps = useMemo(()=>({
    name: 'uploadFiles',
    action: url,
    showUploadList: false,
    multiple: true,
    data: {
      modelName,
      id,
    },
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {

      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
        const { md5, url } = info.file.response;
        tableCtrl.addRow({id: new Date().getTime(),name:info.file.name,isNew:true,md5:md5,url:url});
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  }),[modelName,id]);
  return (
    <Upload {...uploadProps}>
      <Button size="small">
        <UploadOutlined /> 上传
      </Button>
    </Upload>
  );
};

export default TableUploadButton;
