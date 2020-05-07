<template>
    <div>
      <div class="article-title">
        {{ title }}
      </div>
      <div class="article-author">
        {{ author }}
      </div>
      <Divider />
      <Button type="primary" @click="save" style="margin-left: 40px">保存</Button>
      <Button type="warning" @click="cancel" style="margin-left: 10px">取消</Button>
      <Row :gutter="32"
           style="margin-left: 20px; margin-right: 150px; margin-top: 10px; margin-bottom: 20px">
      <Col span="20">
        <div class="markdown-wrapper">
          <textarea ref="editor">
          </textarea>
        </div>
      </Col>
      </Row>
    </div>
</template>

<script>
import Simplemde from 'simplemde';
import 'simplemde/dist/simplemde.min.css';
import { changeMTdata } from '../apis/MindTableEditorApis';
import { pushErr } from '../components/ErrPush';
import { req } from '../apis/util';
// import { req } from '../apis/util';

export default {
  name: 'MarkDownEditorView',
  components: { Simplemde },
  props: {
  },
  data() {
    return {
      editor: null,
      articleData: null,
      title: '',
      author: '',
    };
  },
  methods: {
    save() {
      const dataChange = {
        id: this.$route.query.selected,
        note: this.editor.value(),
      };
      window.console.info(dataChange);
      changeMTdata(dataChange)
        .then(() => {
          this.$Message.info('修改成功!');
          this.$emit('reloadData');
        })
        .catch((err) => {
          pushErr(this, err, true);
        });
      this.$router.push({
        path: '/articleTable',
      });
    },
    cancel() {
      this.$router.push({
        path: '/articleTable',
      });
    },
    getData() {
      req(`/api/articles/${this.$route.query.selected}/`, 'GET').then((res) => {
        this.articleData = res.data;
        window.console.log(res.data);
        this.editor.value(res.data.note);
        this.title = res.data.title;
        this.author = res.data.author;
      }).catch((err) => {
        pushErr(this, err, true);
      });
    },
  },
  mounted() {
    this.editor = new Simplemde({
      placeholder: '请输入您的笔记...',
      toolbar: ['bold', 'italic', 'heading', '|',
        'quote', 'code', '|',
        'unordered-list', 'ordered-list', '|',
        'link', 'image', '|', 'preview'],
    });
    this.getData();
  },
};
</script>


<style scoped>
  .article-title{
    text-align:left;
    font-size: 24px;
    margin-left: 50px;
  }
  .article-author {
    text-align:left;
    font-size: 18px;
    margin-left: 50px;
  }
</style>
