import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
//用来指定商品详情的富文本编辑组件
export default class RichTextEditor extends Component {
    static propsTypes = {
        detail: PropTypes.string
    }

    constructor(props) {
        super(props);
        const html = this.props.detail;
        if (html) {//如果有值，根据html格式字符串创建一个对应的编辑对象，自己做的判断
            const contentBlock = htmlToDraft(html);

            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.state = {
                editorState,
            };
        } else {
            this.state = {
                editorState: EditorState.createEmpty(),//创建一个没有内容的编辑对象
            }

        }

    }
    // 输入过程中实时的回调
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };
    getDetail = () => {

        //返回输入数据对应的html格式文本
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }
    //工具栏中用于提交图片的回调函数
    uploadImageCallBack = (file) => {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/manage/img/upload');
                xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
                const data = new FormData();
                data.append('image', file);
                xhr.send(data);
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText);
                    const url = response.data.url//得到图片地址
                    resolve({ data: { link: url } });  //这个地方官方文档没有说明，再往上百度查的
                });
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                });
            }
        );
    }

    render() {
        const { editorState } = this.state;
        return (
            <div>
                <Editor
                    editorState={editorState}
                    editorStyle={{ border: '1px solid black', minHeight: 200, paddingLeft: 10 }}
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{

                        image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                    }}
                />

            </div>
        );
    }
}