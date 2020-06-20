import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { reqDeleteImg } from '../../api'
import { BASE_IMG_URL } from '../../utils/constants'


//用于图片上传的组件
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends React.Component {
    static porpTypes = {
        imgs: PropTypes.array
    }


    constructor(props) {
        super(props)
        let fileList = []
        //如果传入了imgs属性
        const { imgs } = this.props
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index, //每一个file都有自己唯一的ID，建议设置为负数，防止内部产生ID冲突
                name: img,  //图片文件名
                status: 'done',   //图片的状态done已上传 uploading正在上传 removed已删除
                url: BASE_IMG_URL + img
            }))
        }
        this.state = {
            previewVisible: false,  //标识是否显示大图预览modal
            previewImage: '',  //大图的url
            fileList    //所有已上传图片的数组
        }
    }
    //获取所有已上传图片文件名的数组
    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }

    //隐藏modal
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        console.log('handlePreview', file);

        //显示指定file对应的大图
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };
    //file是当前操作的图片文件（上传/删除）
    //fileList所有已上传图片文件对象的数组
    handleChange = async ({ file, fileList }) => {
        console.log('handlechange');

        //一旦上传成功，将当前上传的file的信息修正（name，url）
        if (file.status === 'done') {
            const result = file.response//{status:0,data:{name:'xxx.jpg',url:'图片地址'}}
            if (result.status === 0) {
                message.success('上传图片成功！')
                const { name, url } = result.data
                //由于fileList[fileList.length-1]与file虽然对应的属性名一样，但是不是同一个对象
                //修正的是fileList
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            } else {
                message.error('上传失败')
            }
        } else if (file.status === 'removed') {//删除图片 在fileList[fileList.length - 1]已经没有该图片，在file中
            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success('删除图片成功')
            } else {
                message.error('删除图片失败')
            }

        }

        //在操作过程中及时更新（fileList的状态）
        this.setState({ fileList })
    };

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div >Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="/manage/img/upload"//上传图片的接口地址
                    accept='image/*' //只接收图片格式
                    name='image'   //请求参数名（发送到后台的文件参数名）在这里对应请求接口的image参数
                    listType="picture-card"   //卡片演示呈现
                    fileList={fileList}     //所有已上传文件对象的数组
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {/* 显示添加的按钮在这里控制，大于8个不能添加 */}
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

