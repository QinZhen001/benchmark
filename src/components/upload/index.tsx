import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import { uploadFile, useAppDispatch, useAppSelector } from '../../common'
import { setFileName, setState } from '../../store/reducers/global'

import './index.css';
import { State } from '/src/types';

const { Dragger } = Upload;

// 文件大小限制（单位：字节）
const maxSize = 300 * 1024 * 1024; // 300MB

const beforeUpload = (file: File) => {
  const exceed = file.size < maxSize;
  if (!exceed) {
    const msg = '文件过大!';
    throw new Error(msg);
  }
  return exceed;
}




const MyUpload = () => {
  const state = useAppSelector((state) => state.global.state)
  const dispatch = useAppDispatch()

  const onClickNext = () => {
    dispatch(setState(State.Selecting))
  }


  const props: UploadProps = {
    name: 'file',
    maxCount: 1,
    multiple: false,
    accept: ".mp3,.wav,.flac,.aac,.pcm,.ogg,.arm,.asf",
    customRequest: async ({ file, onSuccess, onError }: any) => {
      try {
        beforeUpload(file);
        const response = await uploadFile(file);
        onSuccess(response, file);
      } catch (err) {
        onError(err);
      }
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        console.log("done", info.file.name)
        dispatch(setFileName(info.file.name))
        // message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return <div>
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击上传 或将文件拖拽到此处</p>
      <p className="ant-upload-hint">
        支持格式：mp3,wav,flac,aac,pcm,ogg,arm,asf (最大不得超过 300M)
      </p>
    </Dragger>
    <div className='upload-button-wrapper'>
      <div className='next-button' onClick={onClickNext}>下一步</div>
    </div>
  </div>
}


export default MyUpload;
