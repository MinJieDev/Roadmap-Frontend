<template>
  <div>
    <link rel="stylesheet" href="github-markdown.css">
    <div class="article-title">
      {{ title }}
    </div>
    <div class="article-author">
      {{ author }}
    </div>
    <Divider/>
    <Button type="primary" @click="save(source)" style="margin-left: 40px">保存</Button>
    <Button type="warning" @click="cancel" style="margin-left: 10px">取消</Button>
    <Row :gutter="50"
         style="margin-left: 20px; margin-right: 20px; margin-top: 10px; margin-bottom: 20px">
      <Col span="12">
        <div class="markdown-wrapper">
          <textarea ref="editor">
          </textarea>
        </div>
      </Col>
      <Col span="12">
        <div class="markdown-body">
          <VueMarkdown v-if="refreshPreview">{{inputData}}</VueMarkdown>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import _ from 'lodash';
import Simplemde from 'simplemde';
import 'simplemde/dist/simplemde.min.css';
import 'github-markdown-css';
import VueMarkdown from 'vue-markdown';
import { changeMTdata } from '../apis/MindTableEditorApis';
import { createMDnote, changeMDnote } from '../apis/MarkdownEditorApis';
import { pushErr } from '../components/ErrPush';
import { req } from '../apis/util';

export default {
  name: 'MarkDownEditorView',
  components: { Simplemde, VueMarkdown },
  data() {
    return {
      essay: null,
      pageCurrent: 1,
      newsrc: 'noteCreate',
      editor: null,
      // articleData: null,
      title: '',
      author: '',
      // TODO: state, abstract wait for BackEnd
      state: true,
      abstact: '',
      refreshPreview: true,
    };
  },
  methods: {
    save() {
      const note = this.editor.value();
      const dataChange = {
        id: this.$route.query.selected,
        note,
      };
      window.console.info(dataChange);
      if (this.newSrc === 'article') {
        changeMTdata(dataChange).then(() => {
          this.$Message.success('修改成功');
          this.$emit('reloadData', this.pageCurrent);
        }).catch((err) => {
          pushErr(this, err, true);
        });
        this.$router.push({
          path: '/articleTable',
        });
      } else if (this.newSrc === 'noteEdit') {
        changeMDnote(dataChange).then(() => {
          this.$Message.success('修改成功');
          this.$emit('reloadData', this.pageCurrent);
        }).catch((err) => {
          pushErr(this, err, true);
        });
      } else if (this.newSrc === 'noteCreate') {
        // TODO: add author field when backEnd added
        createMDnote(this.title, note).then(() => {
          this.$Message.success('创建成功');
          this.newSrc = 'noteEdit';
          this.$emit('reloadData', this.pageCurrent);
        }).catch((err) => {
          pushErr(this, err, true);
        });
        this.cancel();
      }
    },
    cancel() {
      if (this.source === 'article') {
        this.$router.push({
          path: '/articleTable',
        });
      } else if (this.source === 'noteEdit' || this.source === 'noteCreate') {
        this.$router.push({
          path: '/MDeditorTable',
        });
      }
    },
    getData() {
      this.newSrc = _.clone(this.source);
      this.essay = this.$route.query.esssay;
      this.pageCurrent = this.$route.query.pageCurrent;
      if (this.source === 'article' || this.source === 'noteEdit') {
        this.title = this.essay.title;
        this.author = this.essay.author;
        this.editor.value(this.essay.note);
      } else if (this.source === 'noteCreate') {
        this.title = 'New Note';
        this.author = '';
        this.editor.value('');
      }
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
  computed: {
    source() { // article, noteEdit, noteCreate
      return this.$route.query.source;
    },
    inputData() {
      if (this.editor === null) {
        return '';
      }
      return this.editor.value();
    },
  },
  watch: {
    inputData() {
      this.refreshPreview = false;
      this.$nextTick(() => {
        this.refreshPreview = true;
      });
    },
  },
};
</script>


<style scoped>
  .article-title {
    text-align: left;
    font-size: 24px;
    margin-left: 50px;
  }

  .article-author {
    text-align: left;
    font-size: 18px;
    margin-left: 50px;
  }
</style>
